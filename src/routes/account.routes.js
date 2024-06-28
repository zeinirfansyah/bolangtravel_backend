const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { updateProfile, deleteProfile, selfUpdatePassword, getAuthenticatedUser } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", verifyToken, getAuthenticatedUser);
router.patch("/", verifyToken, updateProfile);
router.delete("/", verifyToken, deleteProfile);
router.put("/password", verifyToken, selfUpdatePassword);

module.exports = router;
