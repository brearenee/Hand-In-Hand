const express = require("express");
const userController = require("../controllers/user-controller.js");
const router = express.Router();


//connect urls with controller methods
router.get("/", userController.getAll);
router.get("/:userId", userController.getUserByID);
router.post("/", userController.createUser);
router.delete("/:userId", userController.deleteUserByID);
router.get("/location/:lastLocation", userController.getUsersByLocation);


module.exports = router;