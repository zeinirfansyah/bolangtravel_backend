const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createBooking,completeBooking } = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", verifyToken, createBooking);

router.patch("/:id", verifyToken, completeBooking);

module.exports = router;
