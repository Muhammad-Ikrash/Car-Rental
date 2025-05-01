const { sql, poolPromise } = require("../config/db");

const Tasks = {

    async GetPaymentsByTransaction(transactionID) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("transaction_id", sql.Int, transactionID)
            .execute("sp_GetPaymentsByTransaction");

        return result.recordset;

    }, 

    async GetTransactionDetails(transactionID) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("transaction_id", sql.Int, transactionID)
            .execute("sp_GetTransactionDetails");

        return result.recordset;

    }, 

    async GetOutstandingTransactionsByCompany(companyID) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("company_id", sql.Int, companyID)
            .execute("sp_GetOutstandingTransactionsByCompany");

        return result.recordset;

    }, 

    async AddTransaction(carID, scheduleID, initialOdo, finalOdo, fuel, maintenanceReq, maintenanceCost, totalCost, remarks, paymentStatusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("car_id", sql.Int, carID)
                .input("schedule_id", sql.Int, scheduleID)
                .input("initial_odometer", sql.Int, initialOdo)
                .input("final_odometer", sql.Int, finalOdo)
                .input("fuel_usage", sql.Decimal(5, 2), fuel)
                .input("maintenance_required", sql.Bit, maintenanceReq)
                .input("maintenance_cost", sql.Decimal(10, 2), maintenanceCost)
                .input("total_cost", sql.Decimal(10, 2), totalCost)
                .input("remarks", sql.Text, remarks)
                .input("payment_status_id", sql.TinyInt, paymentStatusID)
                .execute("sp_AddTransaction");

        } catch (err) {
            console.error("Error adding transaction: ", err);
            throw err;
        }

    },

    async RecordPayment(transactionID, paymentAmount, paymentMethod, currency, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("transaction_id", sql.Int, transactionID)
                .input("payment_amount", sql.Decimal(10, 2), paymentAmount)
                .input("payment_method", sql.VarChar(50), paymentMethod)
                .input("currency", sql.Char(3), currency)
                .input("status_id", sql.TinyInt, statusID)
                .execute("sp_RecordPayment");

        } catch (err) {
            console.error("Error recording payment: ", err);
            throw err;
        }

    }

};

module.exports = Tasks;