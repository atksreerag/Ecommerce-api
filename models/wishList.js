const mongoose = require('mongoose');
const Joi = require('joi');
const isObjectId = require('./validations/isObjectId');


const wishListSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		products: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Products'
		}],
	},
	{
		timestamps: true
	}
);

exports.Wishlist = mongoose.model('wishlist', wishListSchema);


exports.validateWishList = (data) => {
	const schema = Joi.object({
		product: Joi.array()
			.items({
				id: Joi.custom(isObjectId).required()		
			})
	});
	return schema.validate(data);
};

exports.validateDeleteWishList = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).required()
	});
	return schema.validate(data);
};

exports.validateViewWishList = (data) => {
	const schema = Joi.object({
		page: Joi.number().allow('').required()
	});
	return schema.validate(data);
};