const express = require("express");

const lotController = require("../controllers/lot.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

const writeRateLimiter = require("../middleware/rateLimit.middleware");

const router = express.Router();

// Search lots

router.get(
    "/search",
    authenticate,
    authorize("VIEWER", "EDITOR"),
    lotController.searchLots
);

// Track lot

router.get(
    "/:id/track",
    authenticate,
    authorize("VIEWER", "EDITOR"),
    lotController.getLotTracking
);

// View all lots

router.get(
    "/",
    authenticate,
    authorize("VIEWER", "EDITOR"),
    lotController.getAllLots
);

// View one lot

router.get(
    "/:id",
    authenticate,
    authorize("VIEWER", "EDITOR"),
    lotController.getLotById
);

// Create lot

router.post(
    "/",
    authenticate,
    authorize("EDITOR"),
    writeRateLimiter,
    lotController.createLot
);

// Update lot details

router.put(
    "/:id",
    authenticate,
    authorize("EDITOR"),
    writeRateLimiter,
    lotController.updateLot
);

// Update lot status

router.patch(
    "/:id/status",
    authenticate,
    authorize("EDITOR"),
    writeRateLimiter,
    lotController.updateLotStatus
);

// Delete lot

router.delete(
    "/:id",
    authenticate,
    authorize("EDITOR"),
    writeRateLimiter,
    lotController.deleteLot
);

module.exports = router;