const express = require("express");
const { body, validationResult } = require("express-validator");

const carController = require("../controllers/carController");

const router = express.Router();

router.get("/:carID", carController.GetCarDetails);
// router.post();
// router.put();
// router.delete();

module.exports = router;