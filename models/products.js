const mongoose = require('mongoose');
const Joi = require('joi');
const isObjectId = require('./validations/isObjectId');
const heartObjectSchema = require('../models/schemas/heartObject.schema');


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
		category: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		hearts: {
			type: Number,
			default: 0
		},
		heartUsers: [ heartObjectSchema ],
		disLikes: {
			type: Number,
			default: 0
		}
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
		price: Joi.number().integer().min(100).required(),
		category: Joi.string().min(4).max(10).required()
	
	});
	return schema.validate(data);
};

exports.validateFilterProduct = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(128),
		price: Joi.number().integer().min(100),
		category: Joi.string().min(4).max(10),
		page: Joi.number()
	
	});
	return schema.validate(data);
};

exports.validateEditProduct = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).required(),
		name: Joi.string().min(3).max(128).required(),
		description: Joi.string().min(3).max(500).required(),
		price: Joi.number().integer().min(100).required(),
		category: Joi.string().min(4).max(10).required()
	
	});
	return schema.validate(data);
};

exports.validateIsLiked = (data) => {
	const schema = Joi.object({
		isLiked: Joi.boolean(),
		id: Joi.custom(isObjectId).required()
	});
	return schema.validate(data);
};
