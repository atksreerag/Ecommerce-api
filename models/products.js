const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			min: 3,
			required: true
		}
	}, { timestamps: true }
);


exports.productSchema = productSchema;


exports.Products = mongoose.model('Products', productSchema);