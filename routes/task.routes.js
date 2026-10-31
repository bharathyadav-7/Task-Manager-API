const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { create,getTasks,getTask,update,remove,getStats } = require("../controllers/task.controller");

const router = express.Router();

const validate = require("../middleware/validate.middleware");
const { 
    createTaskSchema,
    updateTaskSchema
 } = require("../validators/task.validator");
const validateObjectId = require("../middleware/validateObjectId.middleware");
router.post("/",
    authMiddleware,
    validate(createTaskSchema),
    create
);

router.get("/", authMiddleware, getTasks);
router.get("/stats", authMiddleware, getStats);
router.get("/:id", authMiddleware,validateObjectId(), getTask);


router.patch(
    "/:id",
    authMiddleware,
    validateObjectId(),
    validate(updateTaskSchema),
    update
);
router.delete("/:id", authMiddleware,validateObjectId(), remove);


module.exports = router;