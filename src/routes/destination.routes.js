const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const {createDestinations, getAllDestinations, updateDestination } = require("../controllers/destination.controller");

const router = express.Router();

router.get("/", getAllDestinations);
router.post("/", verifyToken, authorizeRole("admin"), createDestinations);
router.patch("/:id", verifyToken, authorizeRole("admin"), updateDestination);

module.exports = router;
