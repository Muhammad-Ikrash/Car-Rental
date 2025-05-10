const express = require("express");
const { body, validationResult } = require("express-validator");

const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/company/:companyID", bookingController.GetBookingsByCompany);
router.get("/drivers", bookingController.GetAvailableCarsAndDrivers);

router.get("/booking/:bookingID", bookingController.GetBookingDetails);
router.delete("/booking/:bookingID", bookingController.DeleteSchedule);
router.post(
    "/booking",
    [
        body("clientID").notEmpty().isInt(),
        body("carID").notEmpty().isInt(),
        body("driverID").notEmpty().isInt(),
        body("startDate").notEmpty().isISO8601(),
        body("endDate").notEmpty().isISO8601(),
        body("expectedCost").notEmpty().isFloat({ min: 0 }),
        body("locFrom").notEmpty().isString().isLength({ max: 255 }),
        body("locTo").notEmpty().isString().isLength({ max: 255 }),
        body("remarks").notEmpty().isString(),
        body("promotion").optional({ nullable: true }).isInt(),
        body("amount").notEmpty().isFloat({ min: 0 }),
        body("status").notEmpty().isString().isLength({ max: 20 })
    ], 
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