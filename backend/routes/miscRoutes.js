const express = require("express");
const { body, validationResult } = require("express-validator");

const paymentController = require("../controllers/miscController");

const router = express.Router();

router.get("/earnings", paymentController.ReportEarningsByMonth);
router.get("/rentals", paymentController.ReportActiveRentals);

router.post(
    "/maintenance", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    paymentController.AddMaintenanceRecord
);

router.delete("/request/:request_id", paymentController.DeleteCompanyRequest);
router.post(
    "/request",
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    paymentController.SubmitCompanyRequest
);

router.post(
    "/promotion",
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    paymentController.CreatePromotion
);

module.exports = router;