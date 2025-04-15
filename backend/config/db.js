const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, // Set to true if using Azure
        enableArithAbort: true,
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
}

console.log("DB Config: ", dbConfig);

const poolPromise = new sql.ConnectionPool(dbConfig).connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    }).catch(err => console.log('Database connection failed: ', err));

module.exports = { sql, poolPromise };