const mongoose = require('mongoose');


/**
 * Event Like (Heart) Schema
 */
module.exports = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		_id : false,
		timestamps: {
			createdAt: true,
			updatedAt: false
		}
	}
);
