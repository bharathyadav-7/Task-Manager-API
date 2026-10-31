const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const { getAdminDashboard } = require("../controllers/admin.controller");

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

module.exports = router;