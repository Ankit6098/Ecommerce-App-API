const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersController");

router.use("/user", userController.profile);
