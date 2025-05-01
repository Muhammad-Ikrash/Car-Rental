const { sql, poolPromise } = require("../config/db");

const Tasks = {

    async ReportEarningsByMonth() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_ReportEarningsByMonth");

        return result.recordset;

    }, 

    async ReportActiveRentals() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_ReportActiveRentals");

        return result.recordset;

    }, 

    async AddMaintenanceRecord(carID, description, cost, odometer, serviceCenter) {

        const pool = await poolPromise;
        await pool.request()
            .input("car_id", sql.Int, carID)
            .input("description", sql.Text, description)
            .input("cost", sql.Decimal(10, 2), cost)
            .input("odometer_reading", sql.Int, odometer)
            .input("service_center", sql.VarChar(100), serviceCenter)
            .execute("sp_AddMaintenanceRecord");

    }, 

    async SubmitCompanyRequest(companyID, packageName, requestName) {

        const pool = await poolPromise;
        await pool.request()
            .input("company_id", sql.Int, companyID)
            .input("package_name", sql.VarChar(255), packageName)
            .input("request_name", sql.VarChar(50), requestName)
            .execute("sp_SubmitCompanyRequest");

    }, 

    async CreatePromotion(promotionCode, description, discountPercent, startDate, endDate) {
        
        const pool = await poolPromise;
        await pool.request()
            .input("promotion_code", sql.VarChar(50), promotionCode)
            .input("description", sql.Text, description)
            .input("discount_percentage", sql.Decimal(5, 2), discountPercent)
            .input("start_date", sql.Date, startDate)
            .input("end_date", sql.Date, endDate)
            .execute("sp_CreatePromotion");

    }, 

    async DeleteCompanyRequest(requestID) {

        const pool = await poolPromise;
        await pool.request()
            .input("request_id", sql.Int, requestID)
            .execute("sp_DeleteCompanyRequest");

    }

};


module.exports = Tasks;