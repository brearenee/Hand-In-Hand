const express = require("express");
const freeItemController = require("../controllers/free-item-controller.js");
const router = express.Router();


//connect urls with controller methods
router.get("/", freeItemController.getFreeItems);


module.exports = router;