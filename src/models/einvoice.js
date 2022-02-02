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
	responseJSON: {
		type: String,
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

const Einvoice = mongoose.model('Einvoice', einvoiceSchema);
module.exports = Einvoice;