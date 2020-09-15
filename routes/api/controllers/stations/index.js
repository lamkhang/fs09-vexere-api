const express = require("express");
const stationController = require("./station.controller");
const router = express.Router();
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostStation } = require("./../../../../middlewares/validation/stations/postStation");
const { validatePutStation } = require("./../../../../middlewares/validation/stations/putStation")
router.get("/", stationController.getStations);
router.get("/:_id", stationController.getStationById);
router.post("/", authenticate, authorize(["admin"]), validatePostStation, stationController.postStations);
router.put("/:id", authenticate, authorize(["admin"]), validatePutStation, stationController.putStationById);
router.patch("/:id", authenticate, authorize(["admin"]),stationController.patchStationId)
router.delete("/:id", authenticate, authorize(["admin"]),stationController.deleteStationId)

module.exports = router;