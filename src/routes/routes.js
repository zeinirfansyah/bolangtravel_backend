const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { userList, userById } = require("../controllers/user.controller");

const router = express.Router();

router.get("/users", verifyToken, authorizeRole("admin"), userList);
router.get("/users/:id", verifyToken, authorizeRole("admin"), userById);

module.exports = router;
