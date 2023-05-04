const winston = require('winston');
//const config = require('../config/config');
const Response = require('../middlewares/response');

module.exports = async (err, req, res, next) => {
	try {
		// Log the exception
		winston.error(err.message, err);

		// Send response
		let response = Response('error', 'Sorry, Something went wrong', {}, 500);
		res.status(response.statusCode).send(response);
	} catch(error) {}
};
