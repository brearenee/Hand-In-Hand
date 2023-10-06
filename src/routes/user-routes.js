const express = require('express');
const userController = require('../controllers/user-controller.js');
const router = express.Router();

router.get("/", userController.getAll);
//router.get("/users/:userId", userController.getUser);


module.exports = router;