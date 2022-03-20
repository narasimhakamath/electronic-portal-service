const SQLDatabase = require('./sqldatabase');

const signupDB = new SQLDatabase({
	host: process.env.BIZOM_MYSQL_HOST,
	user: process.env.BIZOM_MYSQL_USERNAME,
	password: process.env.BIZOM_MYSQL_PASSWORD,
	database: process.env.BIZOM_SIGNUP_DATABASE
});

module.exports = signupDB;