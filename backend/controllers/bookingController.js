const Task = require("../models/bookingModel");

exports.GetBookingsByCompany = async (req, res) => {

    try {

        const companyID = req.params.companyID;
        const bookings = await Task.GetBookingsByCompany(companyID);

        if (!bookings)
            return res.status(404).json({ message: "No bookings found!" });

        res.status(200).json(bookings);

    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings!" });
    }

}

exports.GetBookingDetails = async (req, res) => {

    try {

        const bookingID = req.params.bookingID;
        const booking = await Task.GetBookingDetails(bookingID);

        if (!booking)
            return res.status(404).json({ message: "Booking not found!" });

        res.status(200).json(booking);

    } catch (err) {
        res.status(500).json({ message: "Error fetching booking details!" });
    }

}

exports.GetAvailableCarsAndDrivers = async (req, res) => {

    try {

        const availableCarsAndDrivers = await Task.GetAvailableCarsAndDrivers();

        if (!availableCarsAndDrivers)
            return res.status(404).json({ message: "No available cars and drivers found!" });

        res.status(200).json(availableCarsAndDrivers);

    } catch (err) {
        res.status(500).json({ message: "Error fetching available cars and drivers!" });
    }

}

exports.AddSchedule = async (req, res) => {

    // add validation shit

    const { clientID, carID, driverID, startDate, endDate, expectedCost, locFrom, locTo, remarks, promotion, amount, status } = req.body;
    await Task.AddSchedule(clientID, carID, driverID, startDate, endDate, expectedCost, locFrom, locTo, remarks, promotion, amount, status);

    res.status(201).json({ message: "Schedule added successfully!" });

}

exports.UpdateBookingStatus = async (req, res) => {

    const { scheduleID, newStatus } = req.body;
    await Task.UpdateBookingStatus(scheduleID, newStatus);

    res.status(204).json({ message: "Booking status updated successfully!" });

}

exports.CancelBooking = async (req, res) => {

    await Task.CancelBooking(req.params.scheduleID);

    res.status(204).json({ message: "Booking cancelled successfully!" });

}