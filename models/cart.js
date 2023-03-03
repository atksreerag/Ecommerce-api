const Joi = require('joi');
const mongoose = require('mongoose');
const isObjectId = require('./validation/isObjectId');

const cartSchema = new mongoose.Schema({
	
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User'
	},
    
	item:[{
		product: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: 'Product'
		},
		quantity: {
			type: Number,
			min: 1
		}
        
	}]
},
{
	timestamps: true
});

exports.Cart = mongoose.model('Cart', cartSchema);

exports.validateCart = (data) => {
	const schema = Joi.object({
		id: Joi.custom(isObjectId).required()

	});
	return schema.validate(data);
};