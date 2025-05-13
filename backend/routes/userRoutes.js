const express = require("express");
const { body, validationResult } = require("express-validator");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/dashboard", userController.GetDashboardStats);

router.get("/", userController.GetAllUsers);

router.post(
    "/login", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    userController.LoginUser
);

router.post(
    "/register", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    userController.RegisterUser
);

router.put(
    "/status", 
    [], 
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors: ", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        next();

    },
    userController.UpdateUserStatus
)

router.delete("/delete/:userID", userController.DeleteUser);

module.exports = router;