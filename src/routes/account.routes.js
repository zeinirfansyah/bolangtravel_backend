const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { updateProfile, deleteProfile, selfUpdatePassword, getAuthenticatedUser } = require("../controllers/user.controller");
const { getAllBookings, getBookingHistories, getBookingById } = require("../controllers/booking.controller");

const router = express.Router();

router.get("/", verifyToken, getAuthenticatedUser);
router.patch("/", verifyToken, updateProfile);
router.delete("/", verifyToken, deleteProfile);
router.put("/password", verifyToken, selfUpdatePassword);
router.get("/booking-history/:limit&:pages", verifyToken, getBookingHistories);
router.get("/booking-history/:id", verifyToken, getBookingById);

module.exports = router;
