const { sql, poolPromise } = require('../config/db');

const Tasks = {

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

    async AddCar(partnerID, category, model, year, licensePlate, color, noOfSeats, fuelType, features, statusID, odometer, pricePerHour, imagePath) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_partner_id", sql.Int, partnerID)
                .input("category", sql.VarChar(20), category)
                .input("model", sql.VarChar(50), model)
                .input("year", sql.Int, year)
                .input("license_plate", sql.VarChar(20), licensePlate)
                .input("color", sql.VarChar(20), color)
                .input("no_seats", sql.TinyInt, noOfSeats)
                .input("fuel_type", sql.VarChar(20), fuelType)
                .input("features", sql.Text, features)
                .input("status_id", sql.TinyInt, statusID)
                .input("odometer_reading", sql.Int, odometer)
                .input("price_per_hour", sql.Decimal(10, 2), pricePerHour)
                .input("image_path", sql.VarChar(255), imagePath)
                .execute("sp_AddCar");

        } catch (err) {
            console.error("Error adding car: ", err);
            throw err;
        }

    }, 

    async AddCarPartner(userID, company, contact, phone, address, contribution) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("user_id", sql.Int, userID)
                .input("company_name", sql.VarChar(100), company)
                .input("contact_person", sql.VarChar(100), contact)
                .input("phone_number", sql.VarChar(15), phone)
                .input("address", sql.VarChar(255), address)
                .input("contribution_percentage", sql.Decimal(5, 2), contribution)
                .execute("sp_AddCarPartner");

        } catch (err) {
            console.error("Error adding car partner: ", err);
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
                .input("model", sql.VarChar(50), model)
                .input("category", sql.VarChar(20), category)
                .input("color", sql.VarChar(20), color)
                .input("fuel_type", sql.VarChar(20), fuelType)
                .input("no_seats", sql.TinyInt, noOfSeats)
                .input("features", sql.Text, features)
                .input("price_per_hour", sql.Decimal(10, 2), pricePerHour)
                .input("image_path", sql.VarChar(255), imagePath)
                .execute("sp_UpdateCarInfo");

        } catch (err) {
            console.error("Error updating car info: ", err);
            throw err;
        }

    },

    async DeleteCar(carID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_id", sql.Int, carID)
                .execute("sp_DeleteCar");

        } catch (err) {
            console.error("Error deleting car: ", err);
            throw err;
        }

    }

};

module.exports = Tasks;