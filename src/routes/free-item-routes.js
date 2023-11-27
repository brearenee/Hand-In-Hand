const express = require("express");
const freeItemController = require("../controllers/free-item-controller.js");
const router = express.Router();

//connect urls with controller methods
router.get("/lat/:lat/long/:long", freeItemController.getFreeItems);


module.exports = router;