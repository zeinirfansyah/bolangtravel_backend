const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../middleware/validator");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

module.exports = router;