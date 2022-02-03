const express = require('express');
const Einvoice = require('../models/einvoice');
const EinvoiceComponent = require('../components/einvoice');

const router = express.Router();

router.post('/einvoices', async (req, res) => {
	const authToken = await EinvoiceComponent.generateAuthToken(req);
	if(!authToken)
		return res.status(400).send({success: false, message: 'Unable to generate the authentication token.'});
});

module.exports = router;