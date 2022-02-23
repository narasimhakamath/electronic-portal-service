const mysql = require('mysql');

const masterDB = mysql.createConnection({
	host: process.env.BIZOM_MYSQL_HOST,
	user: process.env.BIZOM_MYSQL_USERNAME,
	password: process.env.BIZOM_MYSQL_PASSWORD,
	database: process.env.BIZOM_SIGNUP_DATABASE
});

module.exports = masterDB;