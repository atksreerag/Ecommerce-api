const Joi = require('joi');
const mongoose = require('mongoose');
const isObjectId = require('./validations/isObjectId');

const orderSchema = new mongoose.Schema(
	{
		InitialOrderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'InitialOrder',
			required: true
		},
		products: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Products',
			required: true
		}],
		orderId: {
			type: String,
			required: true
		},
		billAmount: {
			type: String,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		status: {
			type: String,
			required: true
		},
		isPaymentCompleted: {
			type: Boolean,
			default: false,
			required: true
		},
		paymentStatus: {
			type: String,
			enum: ['captured']
		},
		name: {
			type: String
		},
		address: {
			type: String
		},
		mobile: {
			type: String
		},
		type: {
			type: String,
			enum: ['COD', 'razorpay'],
			required: true
		},
		deliveryDate: {
			type: Date
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
	},
	{
		timestamps: true,
		toJSON: {
			getters: true,
			setters: true
		}
	});

exports.Order = mongoose.model('Order', orderSchema);

exports.validateOrder = (data) => {
	const schema = Joi.object({
		billAmount: Joi.number().min(1).max(1000000).required(),
		InitialOrderId: Joi.custom(isObjectId).required(),
		name: Joi.string().min(3).max(12),
		address: Joi.string().min(6).max(18),
		mobile: Joi.number().integer(),
		type: Joi.string().valid('COD', 'razorpay').required()
	});
	return schema.validate(data);
};

exports.validateGetOrder = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).allow(''),
		page: Joi.number().integer(),
		startDate: Joi.date().allow(''),
		endDate: Joi.date().allow('')
	});
	return schema.validate(data);
};



