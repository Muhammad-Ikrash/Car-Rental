const Task = require("../models/carModel");

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

exports.GetCarsByPartner = async (req, res) => {

    try {

        const task = await Task.GetCarsByPartner(req.params.partnerID);

        if (!task)
            return res.status(404).json({ message: "No cars found!" });

        res.status(200).json(task);

    } catch (err) {
        res.status(500).json({ message: "Error fetching cars!" });
    }

}

exports.AddCar = async (req, res) => {

    // validate shit

    const { partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath } = req.body;
    await Task.AddCar(partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath);

    res.status(201).json({ message: "Car added successfully!" });

};

exports.AddCarPartner = async (req, res) => {

    const { partnerID, carID } = req.body;
    await Task.AddCarPartner(partnerID, carID);

    res.status(201).json({ message: "Car partner added successfully!" });

}

exports.UpdateCarStatus = async (req, res) => {

    const { carID, statusID } = req.body;
    await Task.UpdateCarStatus(carID, statusID);

    res.status(204).json({ message: "Car status updated successfully!" });

}

exports.UpdateCarInfo = async (req, res) => {

    const { carID, model, category, color, fuelType, noOfSeats, features, pricePerHour, imagePath } = req.body;
    await Task.UpdateCarInfo(carID, model, category, color, fuelType, noOfSeats, features, pricePerHour, imagePath);

    res.status(204).json({ message: "Car info updated successfully!" });

}