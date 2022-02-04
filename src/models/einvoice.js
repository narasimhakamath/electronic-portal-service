const mongoose = require('mongoose');

const einvoiceSchema = new mongoose.Schema({
	companyID: {
		type: Number,
		required: true
	},
	paymentID: {
		type: Number,
		default: 0
	},
	creditnoteID: {
		type: Number,
		default: 0
	},
	invoiceReferenceNumber: {
		type: String,
		required: true,
		length: 64
	},
	qrCode: {
		type: Buffer
	},
	registrationDate: {
		type: Date
	},
	cancellationDate: {
		type: Date,
	},
	responseBody: {
		type: Object,
		required: true
	}
}, {
	timestamps: true
});

einvoiceSchema.methods.toJSON = function() {
	const einvoiceData = this;
	const einvoiceDataObject = einvoiceData.toObject();

	return einvoiceDataObject;
}

einvoiceSchema.index({companyID: 1, paymentID: 1, creditnoteID: 1}, {unique: true});

const Einvoice = mongoose.model('Einvoice', einvoiceSchema);
module.exports = Einvoice;