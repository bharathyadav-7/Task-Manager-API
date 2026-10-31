const express = require("express");
const { register,login,refresh,logout} = require("../controllers/auth.controller");

const router = express.Router();

const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
router.post("/register", 
    validate(registerSchema),
    register
);
router.post(
    "/login",
    validate(loginSchema),
    login
);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;