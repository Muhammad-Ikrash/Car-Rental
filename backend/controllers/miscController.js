const Task = require("../models/miscModel");

exports.ReportEarningsByMonth = async (req, res) => {

    try {

        const earnings = await Task.ReportEarningsByMonth();

        if (!earnings) {
            return res.status(404).json({ message: "No earnings found!" });
        }

        res.status(200).json(earnings);

    } catch (err) {
        res.status(500).json({ message: "Error fetching earnings!" });
    }

}

exports.ReportActiveRentals = async (req, res) => {

    try {

        const rentals = await Task.ReportActiveRentals();

        if (!rentals) {
            return res.status(404).json({ message: "No active rentals found!" });
        }

        res.status(200).json(rentals);

    } catch (err) {
        res.status(500).json({ message: "Error fetching active rentals!" });
    }

}

exports.AddMaintenanceRecord = async (req, res) => {

    // add validation shit

    const { carID, description, cost, odometer, serviceCenter } = req.body;
    await Task.AddMaintenanceRecord(carID, description, cost, odometer, serviceCenter);

    res.status(201).json({ message: "Maintenance record added successfully!" });

}

exports.SubmitCompanyRequest = async (req, res) => {

    // add validation shit

    const { companyID, packageName, requestName } = req.body;
    await Task.SubmitCompanyRequest(companyID, packageName, requestName);

    res.status(201).json({ message: "Company request submitted successfully!" });

}

exports.CreatePromotion = async (req, res) => {

    // add validation shit

    const { promotionCode, description, discountPercent, startDate, endDate } = req.body;
    await Task.CreatePromotion(promotionCode, description, discountPercent, startDate, endDate);

    res.status(201).json({ message: "Promotion created successfully!" });

}

exports.DeleteCompanyRequest = async (req, res) => {

    await Task.DeleteCompanyRequest(req.params.request_id);

    res.status(204).json({ message: "Company request deleted successfully!" });

}
