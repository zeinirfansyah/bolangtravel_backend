const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { createUser, getUsers, getUserById, updateUser, deleteUser, updatePassword } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", verifyToken, authorizeRole("admin"), getUsers);
router.get("/:id", verifyToken, authorizeRole("admin"), getUserById);
router.post("/", verifyToken, authorizeRole("admin"), createUser);
router.patch("/:id", verifyToken, authorizeRole("admin"), updateUser);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteUser);
router.put("/password/:id", verifyToken, authorizeRole("admin"), updatePassword);

module.exports = router;
