const { 
    createTask,
    getUserTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
 } = require("../services/task.service");

const create = async (req, res, next) => {
    try {
        const task = await createTask(
            req.body,
            req.user.userId
        );

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};
const getTasks = async (req, res, next) => {
    try {
        const page = req.query.page === undefined
            ? 1
            : Number(req.query.page);

        const limit = req.query.limit === undefined
            ? 10
            : Number(req.query.limit);

        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                message: "Page must be a positive integer"
            });
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Limit must be an integer between 1 and 100"
            });
        }

        const status = req.query.status;
        const sort = req.query.sort || "-createdAt";
        const search = req.query.search || "";

        if (typeof search !== "string" || search.length > 100) {
            return res.status(400).json({
            message: "Search must be a string with a maximum length of 100 characters"
            });
        }

        const allowedSortFields = [
            "createdAt",
            "updatedAt",
            "title",
            "priority",
            "status"
        ];

        const sortField = sort.startsWith("-")
            ? sort.substring(1)
            : sort;

        if (!allowedSortFields.includes(sortField)) {
            return res.status(400).json({
                message: "Invalid sort field"
            });
        }

        if (
            status &&
            !["pending", "in-progress", "completed"].includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const { tasks, totalTasks } = await getUserTasks(
            req.user.userId,
            page,
            limit,
            status,
            sort,
            search
        );

        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            tasks,
            pagination: {
                page,
                limit,
                totalTasks,
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};
const getTask = async (req, res, next) => {
    try {
        const task = await getTaskById(
            req.params.id,
            req.user.userId
        );

        res.status(200).json({
            task
        });
    } catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        const task = await updateTask(
            req.params.id,
            req.user.userId,
            req.body
        );

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};
const remove = async (req, res, next) => {
    try {
        await deleteTask(
            req.params.id,
            req.user.userId
        );

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
const getStats = async (req, res, next) => {
    try {
        const stats = await getTaskStats(req.user.userId);

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    create,
    getTasks,
    getTask,
    update,
    remove,
    getStats
}