const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({

	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true
	},
	paymentId: {
		type: String,
		required: true,
		min: 4
	},
	paymentType: {
		type: String,
		//required: true,
		min: 4
	},
	status: {
		type: String,
		enum: ['authorized', 'captured', 'failed'],
		//required: true,
		min: 4
	},
	razorpayPayload: [{
		type: String,
		get: function(data) {
			try {
				return JSON.parse(data);
			} catch(err) {
				return data;
			}
		},
		set: function(data) {
			return JSON.stringify(data);
		}
	}],
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
},
{
	timestamps: true,
	toJSON: {
		getters: true,
		setters: true
	}
});

exports.Payment = mongoose.model('Payment', paymentSchema);