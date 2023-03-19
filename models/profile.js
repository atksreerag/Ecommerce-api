const mongoose = require('mongoose');
const Joi = require('joi');
const isObjectId = require('./validations/isObjectId');

const profileSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			min: 4,
			required: true
		},
		lastName: {
			type: String,
			min: 1,			
		},
		address: {
			type: String,
			min: 10,
			required: true
		},
		pincode: {
			type: Number,
			min: 4,
			required: true
		}
	},
	{
		timestamps: true
	}
);

exports.Profile = mongoose.model('profile', profileSchema);


exports.validateProfile = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().min(4).required(),
		lastName: Joi.string().min(1),
		address: Joi.string().min(4).required(),
		pincode: Joi.number().integer().min(4).required()
	});
	return schema.validate(data);
};


exports.validateUpdateProfile = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).required(),
		firstName: Joi.string().min(4).required(),
		lastName: Joi.string().min(1),
		address: Joi.string().min(4).required(),
		pincode: Joi.number().integer().min(4).required()
	});
	return schema.validate(data);
};