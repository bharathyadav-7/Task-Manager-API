const { z } = require("zod");

const createTaskSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters"),

    description: z
        .string()
        .optional(),

    status: z
        .enum(["pending", "in-progress", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional()
});
const updateTaskSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .optional(),

    description: z
        .string()
        .optional(),

    status: z
        .enum(["pending", "in-progress", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional()
}).strict();

module.exports = {
    createTaskSchema,
    updateTaskSchema
};