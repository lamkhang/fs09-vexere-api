const express = require("express");
const tripController = require("./trip.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth");

const router = express.Router();
const { validatePostTrip } = require("./../../../../middlewares/validation/trips/postTrip");
router.get("/", tripController.getTrip);
router.get("/:id", tripController.getTripById);
router.post("/", authenticate, authorize(["admin"]), validatePostTrip, tripController.postTrip);
router.patch("/:id", authenticate, authorize(["admin"]), tripController.patchTripById)
router.delete("/:id", authenticate, authorize(["admin"]), tripController.deleteTripById)

module.exports = router;