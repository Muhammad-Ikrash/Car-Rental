const express = require("express");
const { body, validationResult } = require("express-validator");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.GetAllUsers);
// router.get("")
// router.post();
// router.put();
// router.delete();

module.exports = router;