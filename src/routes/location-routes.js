const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location-controller.js");

router.get("/lat/:lat/long/:long", locationController.getLocationByCoor);
router.get("/id/:id", locationController.getLocationById);
router.post("/", locationController.createLocation);
module.exports = router;