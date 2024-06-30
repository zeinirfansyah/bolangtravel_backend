const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { getAllTravelPackages, getTravelPackageById, createTravelPackage, deleteTravelPackage } = require("../controllers/travel-package.controller");

const router = express.Router();

router.get("/table/:limit&:pages", getAllTravelPackages);
router.get("/:id", getTravelPackageById);
router.post("/", verifyToken, authorizeRole("admin"), createTravelPackage);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteTravelPackage);



module.exports = router;
