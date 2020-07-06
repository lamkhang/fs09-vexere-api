const express = require("express");
const tripController = require("./trip.controller");

const router = express.Router();

router.get("/", tripController.getStrip);
router.post("/", tripController.postStrip);
router.patch("/:id", tripController.patchTripById)
router.delete("/:id", tripController.deleteTripById)

module.exports = router;