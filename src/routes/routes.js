const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile, deleteProfile } = require("../controllers/user.controller");
const { getAllTravelPackages } = require("../controllers/travel-package.controller");

const router = express.Router();

router.get("/users", verifyToken, authorizeRole("admin"), getUsers);
router.get("/user/:id", verifyToken, authorizeRole("admin"), getUserById);
router.post("/user", verifyToken, authorizeRole("admin"), createUser);
router.patch("/user/:id", verifyToken, authorizeRole("admin"), updateUser);
router.delete("/user/:id", verifyToken, authorizeRole("admin"), deleteUser);

router.patch("/account", verifyToken, updateProfile);
router.delete("/account", verifyToken, deleteProfile);

router.get("/travel-packages", getAllTravelPackages);
module.exports = router;
