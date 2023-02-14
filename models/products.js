const mongoose = require('mongoose');
const Joi = require('joi');
const isObjectId = require('./validations/isObjectId');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			min: 3,
			required: true
		},
		price: {
			type: Number,
			min: 0,
			required: true
		},
		description: {
			type: String,
			min: 5,
		},
	}, 
	{ 
		timestamps: true 
	}
);


exports.productSchema = productSchema;

exports.Products = mongoose.model('Products', productSchema);


exports.validateCreateProduct = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(128).required(),
		description: Joi.string().min(3).max(500).required(),
		price: Joi.number().integer().min(100).required()
	
	});
	return schema.validate(data);
};

exports.validateEditProduct = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).required(),
		name: Joi.string().min(3).max(128).required(),
		description: Joi.string().min(3).max(500).required(),
		price: Joi.number().integer().min(100).required()
	
	});
	return schema.validate(data);
};