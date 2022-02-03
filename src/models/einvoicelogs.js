const mongoose = require('mongoose');

const einvoicelogSchema = new mongoose.Schema({
	companyID: {
		type: Number,
		default: 0,
	},
	paymentID: {
		type: Number,
		default: 0
	},
	creditnoteID: {
		type: Number,
		default: 0
	},
	requestBody: {
		type: Object,
	},
	requestHeaders: {
		type: Object,
	},
	responseBody: {
		type: Object,
	}
}, {
	timestamps: true
});


const Einvoicelog = mongoose.model('Einvoicelog', einvoicelogSchema);
module.exports = Einvoicelog;