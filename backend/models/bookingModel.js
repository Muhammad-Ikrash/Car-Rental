const { sql, poolPromise } = require("../config/db");

const Tasks = {

    async GetBookingsByCompany(companyID) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("company_id", sql.Int, companyID)
            .execute("sp_GetBookingsByCompany");

        return result.recordset;

    }, 

    async GetBookingDetails(scheduleID) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("schedule_id", sql.Int, scheduleID)
            .execute("sp_GetBookingDetails");

            return result.recordset;

    }, 

    async GetAvailableCarsAndDrivers() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_GetAvailableCarsAndDrivers");

        return result.recordsets;

    }, 

    async AddSchedule(clientID, carID, driverID, startDate, endDate, expectedCost, locFrom, locTo, remarks, promotion, amount, status) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("client_id", sql.Int, clientID)
                .input("car_id", sql.Int, carID)
                .input("driver_id", sql.Int, driverID)
                .input("start_date", sql.DateTime, startDate)
                .input("end_date", sql.DateTime, endDate)
                .input("expected_cost", sql.Decimal(10, 2), expectedCost)
                .input("location_from", sql.VarChar(255), locFrom)
                .input("location_to", sql.VarChar(255), locTo)
                .input("remarks", sql.Text, remarks)
                .input("promotion_id", sql.Int, promotion)
                .input("amount_paid", sql.Decimal(10, 2), amount)
                .input("status", sql.VarChar(20), status)
                .execute("sp_AddSchedule");

        } catch (err) {
            console.error("Error adding schedule: ", err);
            throw err;
        }

    }, 

    async UpdateBookingStatus(scheduleID, newStatus) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("schedule_id", sql.Int, scheduleID)
                .input("new_status", sql.VarChar(20), newStatus)
                .execute("sp_UpdateBookingStatus");

        } catch (err) {
            console.error("Error updating booking status: ", err);
            throw err;
        }

    }, 

    async CancelBooking(scheduleID) {
        
        const pool = await poolPromise;
        await pool.request()
            .input("schedule_id", sql.Int, scheduleID)
            .execute("sp_CancelBooking");

    }, 

    async DeleteSchedule(scheduleID) {

        const pool = await poolPromise;
        await pool.request()
            .input("schedule_id", sql.Int, scheduleID)
            .execute("sp_DeleteSchedule");

    },

};

module.exports = Tasks;