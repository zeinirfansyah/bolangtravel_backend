const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { createBooking,completeBooking, getAllBookings, getBookingById } = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", verifyToken, authorizeRole("admin"), createBooking);
router.get("/table/:limit&:pages", verifyToken, authorizeRole("admin"), getAllBookings);
router.get("/:id", verifyToken, authorizeRole("admin"), getBookingById);
router.patch("/:id", verifyToken, authorizeRole("admin"), completeBooking);

module.exports = router;
