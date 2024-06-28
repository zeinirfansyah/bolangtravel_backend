const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const {createDestinations, getAllDestinations } = require("../controllers/travel-package.controller");

const router = express.Router();

router.get("/", getAllDestinations);
router.post("/", verifyToken, authorizeRole("admin"), createDestinations);

module.exports = router;
