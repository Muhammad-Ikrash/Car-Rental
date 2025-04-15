const Task = require("../models/carModel");

exports.AddCar = async (req, res) => {

    // validate shit

    const { partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath } = req.body;
    await Task.AddCar(partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath);

    res.status(201).json({ message: "Car added successfully!" });

};

exports.GetCarDetails = async (req, res) => {

    try {

        const task = await Task.GetCarDetails(req.params.carID);

        if (!task)
            return res.status(404).json({ message: "Car not found!" });

        res.status(200).json(task);

    } catch (err) {
        res.status(500).json({ message: "Error fetching car details!" });
    }

}