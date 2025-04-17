const express = require("express");
const { body, validationResult } = require("express-validator");

const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.get("/transaction/:transactionID", paymentController.GetTransactionDetails);
router.post(
    "/transaction", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    }, 
    paymentController.AddTransaction
);

router.get("/payment/:paymentID", paymentController.GetPaymentsByTransaction);
router.post(
    "/payment", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    }, 
    paymentController.AddPayment
);

router.get("/outstanding/:companyID", paymentController.GetOutstandingTransactionsByCompany);

module.exports = router;