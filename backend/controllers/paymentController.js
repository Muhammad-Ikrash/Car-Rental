const Task = require("../models/paymentModel");

exports.GetTransactionDetails = async (req, res) => {

    try {

        const transactionID = req.params.transactionID;
        const transaction = await Task.GetTransactionDetails(transactionID);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found!" });
        }

        res.status(200).json(transaction);

    } catch (err) {
        res.status(500).json({ message: "Error fetching transaction details!" });
    }

}

exports.GetPaymentsByTransaction = async (req, res) => {

    try {

        const transactionID = req.params.transactionID;
        const payments = await Task.GetPaymentsByTransaction(transactionID);

        if (!payments) {
            return res.status(404).json({ message: "Payments not found!" });
        }

        res.status(200).json(payments);

    } catch (err) {
        res.status(500).json({ message: "Error fetching payments!" });
    }

}

exports.GetOutstandingTransactionsByCompany = async (req, res) => {

    try {

        const companyID = req.params.companyID;
        const transactions = await Task.GetOutstandingTransactionsByCompany(companyID);

        if (!transactions) {
            return res.status(404).json({ message: "No outstanding transactions found!" });
        }

        res.status(200).json(transactions);

    } catch (err) {
        res.status(500).json({ message: "Error fetching outstanding transactions!" });
    }

}

exports.AddTransaction = async (req, res) => {

    // add validation shit

    const { carID, scheduleID, initialOdo, finalOdo, fuel, maintenanceReq, maintenanceCost, totalCost, remarks, paymentStatusID } = req.body;
    await Task.AddTransaction(carID, scheduleID, initialOdo, finalOdo, fuel, maintenanceReq, maintenanceCost, totalCost, remarks, paymentStatusID);

    res.status(201).json({ message: "Transaction added successfully!" });

}

exports.RecordPayment = async (req, res) => {

    // add validation shit

    const { transactionID, paymentAmount, paymentMethod, currency, statusID } = req.body;
    await Task.RecordPayment(transactionID, paymentAmount, paymentMethod, currency, statusID);

    res.status(201).json({ message: "Payment recorded successfully!" });

}