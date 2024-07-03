const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createBooking } = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", verifyToken, createBooking);



module.exports = router;
