const axios = require('axios');

const generateAuthToken = async (request) => {
	let authToken = '';

	const postURL = `${process.env.MASTERGST_GENERATE_TOKEN_URL}?email=${process.env.MASTERGST_MAIL_ADDRESS}`;
	const headers = {
		username: request['headers']['username'],
		password: request['headers']['password'],
		ip_address: request['connection']['remoteAddress'],
		client_id: process.env.MASTERGST_CLIENT_ID,
		client_secret: process.env.MASTERGST_CLIENT_SECRET_ID,
		gstin: request['headers']['gstin']
	}

	const response = await axios.get(postURL, {headers});

	if(response['data']['status_cd'] != 0)
		authToken = response['data']['data']['AuthToken'];

	return authToken;
}

module.exports = {
	generateAuthToken
}