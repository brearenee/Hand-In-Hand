const express = require("express");
const userController = require("../controllers/user-controller.js");
const router = express.Router();


//connect urls with controller methods
router.get("/", userController.getAll);
router.get("/:userId", userController.getUserByID);
router.get("/email/:email", userController.getUsersByEmail);
router.post("/", userController.createUser);
router.delete("/:userId", userController.deleteUserByID);
router.get("/location/:lastLocation", userController.getUsersByLocation);
router.put("/:userId", userController.updateUser);
router.get("/username/:username", userController.getUsersByUserName);


module.exports = router;