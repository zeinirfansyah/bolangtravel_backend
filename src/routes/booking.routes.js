const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { createBooking,completeBooking, getAllBookings, getBookingById, updateBooking, getBookingHistories, deleteBooking } = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/booking-history", verifyToken, getBookingHistories);
router.put("/complete-booking/:id", verifyToken, completeBooking);
router.get("/:id", verifyToken, getBookingById);

router.get("/table/:limit&:pages", verifyToken, authorizeRole("admin"), getAllBookings);
router.patch("/:id", verifyToken, authorizeRole("admin"), updateBooking);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteBooking);

module.exports = router;
