const express = require('express');
const userController = require('../controllers/user-controller.js');
const router = express.Router();

router.get("/", userController.getAll);
router.get("/:userId", userController.getUserByID);
router.post("/", userController.createUser);


module.exports = router;