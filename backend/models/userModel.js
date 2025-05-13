const { sql, poolPromise } = require("../config/db");

const Tasks = {

    async GetDashboardStats() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_GetDashboardStats");

        return result.recordsets;

    }, 

    async GetAllUsers() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_GetAllUsers");

        return result.recordsets;

    },

    async LoginUser(username, password) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.VarChar(50), username)
            .input("password", sql.VarChar(255), password)
            .execute("sp_LoginUser");

        return result.recordset[0];

    },

    async RegisterUser(username, password, email, role, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("username", sql.VarChar(50), username)
                .input("password", sql.VarChar(255), password)
                .input("email", sql.VarChar(100), email)
                .input("role", sql.VarChar(20), role)
                .input("status_id", sql.TinyInt, statusID)
                .execute("sp_RegisterUser");

        } catch (err) {
            console.error("Error registering user: ", err);
            throw err;
        }

    }, 

    async UpdateUserStatus(userID, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("user_id", sql.Int, userID)
                .input("new_status_id", sql.TinyInt, statusID)
                .execute("sp_UpdateUserStatus");

        } catch (err) {
            console.error("Error updating user status: ", err);
            throw err;
        }

    }, 

    async DeleteUser(userID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("user_id", sql.Int, userID)
                .execute("sp_DeleteUser");

        } catch (err) {
            console.error("Error deleting user: ", err);
            throw err;
        }

    }

};

module.exports = Tasks;