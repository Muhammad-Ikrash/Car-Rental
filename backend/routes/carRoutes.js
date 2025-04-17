const express = require("express");
const { body, validationResult } = require("express-validator");

const carController = require("../controllers/carController");

const router = express.Router();

router.get("/car/:carID", carController.GetCarDetails);
router.delete("/car/:carID", carController.DeleteCar);
router.post(
    "/car", 
    [
        // checks
        // body('title').notEmpty().withMessage('Title is required'),
        // body('description').isLength({ min: 5 }).withMessage('Description should be at least 5 characters'),
    ], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    }, 
    carController.AddCar
);

router.get("/partner/:partnerID", carController.GetCarsByPartner);
router.post(
    "/partner", 
    [
        // checks
    ], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    }, 
    carController.AddCarPartner
);

router.put(
    "/car/status", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    carController.UpdateCarStatus
);
router.put(
    "/car/info", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    carController.UpdateCarInfo
);

module.exports = router;