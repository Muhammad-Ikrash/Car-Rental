const { sql, poolPromise } = require('../config/db');

const Tasks = {

    async AddCar(partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_partner_id", sql.Int, partnerID)
                .input("category", sql.VarChar, category)
                .input("model", sql.VarChar, model)
                .input("year", sql.Int, year)
                .input("license_plate", sql.VarChar, licensePlate)
                .input("color", sql.VarChar, color)
                .input("no_seats", sql.TinyInt, noOfSeats)
                .input("fuel_type", sql.VarChar, fuelType)
                .input("features", sql.Text, features)
                .input("status_id", sql.TinyInt, statusID)
                .input("odometer_reading", sql.Int, odometer)
                .input("price_per_hour", sql.Decimal, pricePerHour)
                .input("image_path", sql.VarChar, imagePath)
                .execute("sp_AddCar");

        } catch (err) {
            console.error("Error adding car: ", err);
            throw err;
        }

    },

    async UpdateCarStatus(carID, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_id", sql.Int, carID)
                .input("status_id", sql.TinyInt, statusID)
                .execute("sp_UpdateCarStatus");

        } catch (err) {
            console.error("Error updating car status: ", err);
            throw err;
        }

    }, 

    async UpdateCarInfo(carID, model, category, color, fuelType, noOfSeats, features, pricePerHour, imagePath) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_id", sql.Int, carID)
                .input("model", sql.VarChar, model)
                .input("category", sql.VarChar, category)
                .input("color", sql.VarChar, color)
                .input("fuel_type", sql.VarChar, fuelType)
                .input("no_seats", sql.TinyInt, noOfSeats)
                .input("features", sql.Text, features)
                .input("price_per_hour", sql.Decimal, pricePerHour)
                .input("image_path", sql.VarChar, imagePath)
                .execute("sp_UpdateCarInfo");

        } catch (err) {
            console.error("Error updating car info: ", err);
            throw err;
        }

    }, 

    async GetCarDetails(carID) {

        try {

            const pool = await poolPromise;
            const result = await pool.request()
                .input("car_id", sql.Int, carID)
                .execute("sp_GetCarDetails");

            return result.recordset;

        } catch (err) {
            console.error("Error getting car details: ", err);
            throw err;
        }

    }, 

    async GetCarsByPartner(partnerID) {

        try {

            const pool = await poolPromise;
            const result = await pool.request()
                .input("partner_id", sql.Int, partnerID)
                .execute("sp_GetCarsByPartner");

            return result.recordsets;

        } catch (err) {
            console.error("Error getting cars by partner: ", err);
            throw err;
        }

    }, 

    async GetAvailableCarsAndDrivers() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_GetAvailableCarsAndDrivers");

        return result.recordsets;

    }

};

module.exports = Tasks;