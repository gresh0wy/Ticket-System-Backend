require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT || 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_ROOT_PASSWORD,
    database: process.env.MARIADB_DATABASE_NAME
})






module.exports = pool;

