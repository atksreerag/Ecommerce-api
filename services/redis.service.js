const Redis = require('ioredis');
const winston = require('winston');
const config = require('../config/config');


/**
 * Redis connection will be served from here
 * @returns {Object} redis object
 */
module.exports = async () => {
	try {
		const client = await new Redis();

		client.on('connect', () => {
			console.log('connected to Redis');
			winston.info('connected to Redis');
		});
        
		client.on('error', (err) => {
			console.log(`Redis has occurred - ${ err }`);
			winston.error(`Redis has occurred ${ err }`);
		});

		return client;
	} catch (error) {
		winston.error(`Redis Service has occurred ${ error }`);
		return null;
	}
};
