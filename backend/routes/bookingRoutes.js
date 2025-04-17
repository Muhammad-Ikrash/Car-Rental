const express = require("express");
const { body, validationResult } = require("express-validator");

const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/company/:companyID", bookingController.GetBookingsByCompany);
router.get("/drivers", bookingController.GetAvailableCarsAndDrivers);

router.get("/booking/:bookingID", bookingController.GetBookingDetails);
router.post(
    "/booking",
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    bookingController.AddSchedule
);
router.put(
    "/booking", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    bookingController.UpdateBookingStatus
)
router.put(
    "/booking/cancel/:scheduleID", 
    [],
    (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    bookingController.CancelBooking
);

module.exports = router;