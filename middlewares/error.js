const winston = require('winston');
//const config = require('../config/config');
const Response = require('../config/response');
//const email = require('../services/email.service');
//const SECRETS = require('../config/secrets');


/**
 * Any exceptions thrown in the app will end up in here
 * Here we log it to our logging DB/File
 * Send an alert to the developer by Email or in any other form
 * Return a structured response to the end user
 */
module.exports = async (err, req, res, next) => {
	try {
		// Log the exception
		winston.error(err.message, err);

		// Send Alert
		// Send error to the developer's email
		// email(
		// 	SECRETS.SERVER_EMAIL, SECRETS.ADMIN_EMAIL, `lookODU ${config.ENVIRONMENT.toUpperCase()} Error Occured`, 
		// 	err.stack.toString()
		// );

		// Send response
		let response = Response('error', 'Sorry, Something went wrong', {}, 500);
		res.status(response.statusCode).send(response);
	} catch(error) {}
};
