const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { getAllTravelPackages, getTravelPackageById, createTravelPackage, deleteTravelPackage, updateTravelPackage, getFilteredTravel } = require("../controllers/travel-package.controller");

const router = express.Router();

router.get("/table/:limit&:pages&:category", getFilteredTravel);
router.get("/table/:limit&:pages", getAllTravelPackages);
router.get("/:id", getTravelPackageById);
router.post("/", verifyToken, authorizeRole("admin"), createTravelPackage);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteTravelPackage);
router.patch("/:id", verifyToken, authorizeRole("admin"), updateTravelPackage);



module.exports = router;
