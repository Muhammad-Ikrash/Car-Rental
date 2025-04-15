const { sql, poolPromise } = require("../config/db");

const Tasks = {

    async RegisterUser(username, password, email, role, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("username", sql.VarChar, username)
                .input("password", sql.VarChar, password)
                .input("email", sql.VarChar, email)
                .input("role", sql.VarChar, role)
                .input("status_id", sql.TinyInt, statusID)
                .execute("sp_RegisterUser");

        } catch (err) {
            console.error("Error registering user: ", err);
            throw err;
        }

    },

    async LoginUser(username, password) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar, password)
            .execute("sp_LoginUser");

        return result.recordset[0];

    }, 

    async UpdateUserStatus(userID, statusID) {

        try {

            const pool = await poolPromise;
            await pool.request()
                .input("user_id", sql.Int, userID)
                .input("status_id", sql.TinyInt, statusID)
                .execute("sp_UpdateUserStatus");

        } catch (err) {
            console.error("Error updating user status: ", err);
            throw err;
        }

    }, 

    async GetAllUsers() {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute("sp_GetAllUsers");

        return result.recordsets;

    }

};

module.exports = Tasks;