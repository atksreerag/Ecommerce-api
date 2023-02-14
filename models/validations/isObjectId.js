const ObjectId = require('mongoose').Types.ObjectId;


/**
 * MongoDB Object Id Validator Method for Joi
 */
module.exports = (value, helpers) => {

	if (!ObjectId.isValid(value)) {
		return helpers.message('Invalid ' + helpers.state.path);
	}

	return value;
};
