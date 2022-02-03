const express = require('express');
const axios = require('axios');
const Einvoice = require('../models/einvoice');
const EinvoiceComponent = require('../components/einvoice');
const {convertJWTToBuffer} = require('../utilities');

const router = express.Router();

router.post('/einvoices', async (req, res) => {
	const authToken = await EinvoiceComponent.generateAuthToken(req);
	if(!authToken)
		return res.status(400).send({success: false, message: 'Unable to generate the authentication token.'});

	const postURL = `${process.env.MASTERGST_GENERATE_INVOICE_URL}?email=${process.env.MASTERGST_MAIL_ADDRESS}`;

	const headers = {
		'ip_address': '127.0.0.1',
		'client_id': process.env.MASTERGST_CLIENT_ID,
		'client_secret': process.env.MASTERGST_CLIENT_SECRET_ID,
		'username': req['headers']['username'],
		'auth-token': authToken,
		'gstin': req['headers']['gstin']
	};

	const response = await axios.post(postURL, req['body'], {headers});

	if(response['data']['status_cd'] == 0)
		return res.status(400).send({success: false, message: 'Unable to generate the E-Invoice.'});

	const signedQRCodeBuffer = await convertJWTToBuffer(response['data']['data']['SignedQRCode']);

	const companyID = req['headers']['companyid'];
	const paymentID = req['headers']['paymentid'] || 0;
	const creditnoteID = req['headers']['creditnoteid'] || 0;

	const einvoiceData = new Einvoice({
		companyID: companyID,
		paymentID: paymentID,
		creditnoteID: creditnoteID,
		invoiceReferenceNumber: response['data']['data']['Irn'],
		qrCode: signedQRCodeBuffer,
		registrationDate: new Date(response['data']['data']['AckDt']),
		responseJSON: JSON.stringify(response['data'])
	});

	try {
		await einvoiceData.save();

		const responseData = {
			invoiceReferenceNumber: response['data']['data']['Irn'],
			qrCodeImageURL: `${req.protocol}://${req.get('host')}/einvoices/qrcode?companyID=${companyID}&paymentID=${paymentID}&creditnoteID=${creditnoteID}`
		};

		res.status(201).send({success: true, message: 'IRN generated successfully.', data: responseData});
	} catch(e) {
		console.log(e);
		res.status(400).send({success: false, message: 'Something went wrong. Contact the support team for assistance.'});
	}
});

router.get('/einvoices/qrcode', async (req, res) => {
	const paymentID = req['query']['paymentID'] || 0;
	const creditnoteID = req['query']['creditnoteID'] || 0;
	const companyID = req['query']['companyID'] || 0;

	try {
		const einvoiceData = await Einvoice.findOne({companyID, paymentID, creditnoteID}).select('qrCode');
		if(!einvoiceData)
			throw new Error();

		res.status(200);
		res.set('Content-Type', 'image/png');
		res.send(einvoiceData['qrCode']);
	} catch(e) {
		console.log(e);
		res.status(400).send();
	}
});

module.exports = router;