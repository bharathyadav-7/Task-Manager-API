const Task = require("../models/task");

const createTask = async (taskData, userId) => {
    const task = await Task.create({
        ...taskData,
        user: userId
    });

    return task;
};
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const getUserTasks = async (userId, page, limit, status,sort,search) => {
    const skip = (page - 1) * limit;

    const filter = {
        user: userId
    };
    if (search) {
    const safeSearch = escapeRegex(search);

    filter.$or = [
        {
            title: {
                $regex: safeSearch,
                $options: "i"
            }
        },
        {
            description: {
                $regex: safeSearch,
                $options: "i"
            }
        }
    ];
}

    if (status) {
        filter.status = status;
    }

    const tasks = await Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalTasks = await Task.countDocuments(filter);

    return {
        tasks,
        totalTasks
    };
};
const getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({
        _id: taskId,
        user: userId
    });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return task;
};
const updateTask = async (taskId, userId, updateData) => {
    const allowedFields = [
        "title",
        "description",
        "status",
        "priority"
    ];

    const safeUpdateData = {};

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(updateData, field)) {
            safeUpdateData[field] = updateData[field];
        }
    }

    if (Object.keys(safeUpdateData).length === 0) {
        const error = new Error("No valid fields provided for update");
        error.statusCode = 400;
        throw error;
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            user: userId
        },
        {
            $set: safeUpdateData
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return task;
};
const deleteTask = async (taskId, userId) => {
    const task = await Task.findOneAndDelete({
        _id: taskId,
        user: userId
    });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return task;
};
const getTaskStats = async (userId) => {
    const totalTasks = await Task.countDocuments({
        user: userId
    });

    const pendingTasks = await Task.countDocuments({
        user: userId,
        status: "pending"
    });

    const inProgressTasks = await Task.countDocuments({
        user: userId,
        status: "in-progress"
    });

    const completedTasks = await Task.countDocuments({
        user: userId,
        status: "completed"
    });

    const highPriorityTasks = await Task.countDocuments({
        user: userId,
        priority: "high"
    });

    return {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        highPriorityTasks
    };
};
module.exports = {
    createTask,
    getUserTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
};