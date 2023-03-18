const mysql = require('mysql2/promise');
require('dotenv').config();

const { MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASS } = process.env;

const getDB = async () => {
  let pool;

  try {
    if (!pool) {
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS,
        database: MYSQL_DB,
        timezone: 'Z',
      });
    }

    return await pool.getConnection();
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = getDB;
