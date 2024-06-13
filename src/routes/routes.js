const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../middleware/validator");

const router = express.Router();

router.post("/auth/register", validateRegister, register);
router.post("/auth/login", validateLogin, login);

module.exports = router;