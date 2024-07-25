const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const {
  createDestinations,
  getAllDestinations,
  updateDestination,
  getDestinationById,
  deleteDestination,
} = require("../controllers/destination.controller");

const router = express.Router();

router.get("/table/:limit&:pages", getAllDestinations);
router.get("/:id", getDestinationById);
router.post("/", verifyToken, authorizeRole("admin"), createDestinations);
router.patch("/:id", verifyToken, authorizeRole("admin"), updateDestination);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteDestination);

module.exports = router;
