const express = require('express');
const axios = require('axios');
const Einvoice = require('../models/einvoice');
const EinvoiceComponent = require('../components/einvoice');
const {convertJWTToBuffer} = require('../utilities');

const router = express.Router();

router.post('/einvoices/generateIRN', async (req, res) => {
	const authToken = await EinvoiceComponent.generateAuthToken(req);
	if(!authToken)
		return res.status(400).send({success: false, message: 'Unable to generate the authentication token.'});

	const requestURL = `${process.env.MASTERGST_GENERATE_INVOICE_URL}?email=${process.env.MASTERGST_MAIL_ADDRESS}`;

	const requestHeaders = {
		'ip_address': '127.0.0.1',
		'client_id': process.env.MASTERGST_CLIENT_ID,
		'client_secret': process.env.MASTERGST_CLIENT_SECRET_ID,
		'username': req['headers']['username'],
		'auth-token': authToken,
		'gstin': req['headers']['gstin']
	};

	const response = await axios.post(requestURL, req['body'], {headers: requestHeaders});

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
		responseBody: JSON.stringify(response['data'])
	});

	try {
		await einvoiceData.save();

		const responseData = {
			invoiceReferenceNumber: response['data']['data']['Irn'],
			qrCodeImageURL: `${req.protocol}://${req.get('host')}/einvoices/getQRCode?companyID=${companyID}&paymentID=${paymentID}&creditnoteID=${creditnoteID}`
		};

		res.status(201).send({success: true, message: 'IRN generated successfully.', data: responseData});
	} catch(e) {
		console.log(e);
		res.status(400).send({success: false, message: 'Something went wrong. Contact the support team for assistance.'});
	}
});

<<<<<<< HEAD
router.get('/einvoices/getQRCode', async (req, res) => {
=======
router.get('/einvoices/qrcode', async (req, res) => {
>>>>>>> b72f5210abf2c7cf9af6c1ab6963e18f1943e351
	const companyID = req['query']['companyID'] || 0;
	const paymentID = req['query']['paymentID'] || 0;
	const creditnoteID = req['query']['creditnoteID'] || 0;

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

<<<<<<< HEAD
router.get('/einvoices/getIRN', async (req, res) => {
=======
router.get('/einvoices', async (req, res) => {
>>>>>>> b72f5210abf2c7cf9af6c1ab6963e18f1943e351
	const companyID = req['query']['companyID'] || 0;
	const paymentID = req['query']['paymentID'] || 0;
	const creditnoteID = req['query']['creditnoteID'] || 0;

	if(companyID == 0 || (paymentID == 0 && creditnoteID == 0))
		res.status(400).send({success: false, message: 'Invalid request.'});

	try {
		const einvoiceData = await Einvoice.findOne({companyID, paymentID, creditnoteID}).select('invoiceReferenceNumber registrationDate');
		if(!einvoiceData)
			res.status(404).send({success: false, message: 'No transaction found in the system for the requested parameters.'});

		const responseData = {
			invoiceReferenceNumber: einvoiceData['invoiceReferenceNumber'],
			registrationDate: einvoiceData['registrationDate'],
<<<<<<< HEAD
			qrCodeImageURL: `${req.protocol}://${req.get('host')}/einvoices/getQRCode?companyID=${companyID}&paymentID=${paymentID}&creditnoteID=${creditnoteID}`
=======
			qrCodeImageURL: `${req.protocol}://${req.get('host')}/einvoices/qrcode?companyID=${companyID}&paymentID=${paymentID}&creditnoteID=${creditnoteID}`
>>>>>>> b72f5210abf2c7cf9af6c1ab6963e18f1943e351
		};

		res.status(200).send({success: true, message: 'Transaction found.', data: responseData});
	} catch(e) {
		console.log(e);
		res.status(400).send({success: false, message: 'Could not process the request.'});
	}
});

router.post('/einvoices/cancelIRN', async (req, res) => {
	const invoiceReferenceNumber = req['body']['invoiceReferenceNumber'] || '';
	const companyID = req['headers']['companyid'];
	const paymentID = req['headers']['paymentid'] || 0;
	const creditnoteID = req['headers']['creditnoteid'] || 0;

	if(!invoiceReferenceNumber || !companyID || (!paymentID && !creditnoteID))
		res.status(400).send({success: false, message: 'Invalid request.'});

	try {
		const einvoiceData = await Einvoice.findOne({invoiceReferenceNumber});

		if(!einvoiceData)
			res.status(404).send({success: false, message: `No transaction found with the IRN: ${invoiceReferenceNumber}`});

		// Add validation to check if the current time is past 24 hours since generation of the IRN.

		const authToken = await EinvoiceComponent.generateAuthToken(req);
		if(!authToken)
			return res.status(400).send({success: false, message: 'Unable to generate the authentication token.'});

		const requestURL = `${process.env.MASTERGST_CANCEL_INVOICE_URL}?email=${process.env.MASTERGST_MAIL_ADDRESS}`;

		const requestHeaders = {
			'ip_address': '127.0.0.1',
			'client_id': process.env.MASTERGST_CLIENT_ID,
			'client_secret': process.env.MASTERGST_CLIENT_SECRET_ID,
			'username': req['headers']['username'],
			'auth-token': authToken,
			'gstin': req['headers']['gstin']
		};

		const requestBody = {
			'Irn': invoiceReferenceNumber,
			'CnlRsn': '1',
			'CnlRem': 'Wrong entry'
		}

		const response = await axios.post(requestURL, requestBody, {headers: requestHeaders});

		if(response['data']['status_cd'] == 0)
			return res.status(400).send({success: false, message: 'Unable to cancel the E-Invoice.'});

		await Einvoice.findOneAndUpdate({invoiceReferenceNumber}, {cancellationDate: new Date(response['data']['data']['CancelDate'])});

		res.status(201).send({success: true, message: 'IRN cancelled successfully'});
	} catch(e) {
		console.log(e);
		res.status(201).send({success: false, message: 'Could not process the request.'});
	}
});

module.exports = router;