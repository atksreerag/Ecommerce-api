const mongoose = require('mongoose');
const joi = require('joi');

const initialOrderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		billAmount: {
			type: Number,
			required: true
		},
		paidAmount: {
			type: Number
		},
		notes: {
			type: String,
			min: 3,
			max: 128
		},
		
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order'
		},
		// paymentInitiatedAt: {
		// 	type: Date
		// },
		// isUserReceivedPaymentRequest: {
		// 	type: Boolean,
		// 	default: false
		// },
		// userReceivedPaymentRequestAt: {
		// 	type: Date
		// },
		isOrderCreated: {
			type: Boolean,
			default: false
		},
		orderCreatedAt: {
			type: Date
		},
		isPaymentCancelled: {
			type: Boolean,
			default: false
		},
		paymentCancelledAt: {
			type: Date
		},
		isPaymentCompleted: {
			type: Boolean,
			default: false
		},
		paymentCompletedAt: {
			type: Date
		},
		orders: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order'
		}],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
);

exports.InitialOrder = mongoose.model('InitialOrder', initialOrderSchema);