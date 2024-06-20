const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { userList } = require("../controllers/user.controller");

const router = express.Router();

router.get("/users", verifyToken, authorizeRole("admin"), userList);

module.exports = router;
