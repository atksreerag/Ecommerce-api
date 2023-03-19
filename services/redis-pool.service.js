const winston = require('winston');
const redisConnection = require('../services/redis.service');


/**
 * Retrieve cache value for a key
 * @param {string} key 
 * @returns {Object}
 */
exports.get = async (key) => {
	try {
		const redis = await redisConnection();

		var value = await redis.get(key);

		await redis.disconnect();
        
		// Converting to JSON Object
		try {
			value = JSON.parse(value);
		} catch {}

		return value;
	} catch (error) {
		winston.error(error);
		return null;
	}
};


/**
 * Set cache value for a key
 * @param {string} key 
 * @param {string} value 
 * @param {number} expiry 
 * @returns 
 */
exports.set = async (key, value, expiry = 300) => {
	try {
		const redis = await redisConnection();

		// Converting to String
		value = JSON.stringify(value);

		await redis.set(key, value, 'ex', expiry);

		await redis.disconnect();

		return 'success';
	} catch (error) {
		winston.error(error);
		return null;
	}
};


/**
 * Delete cache
 * @param {string} key 
 */
exports.delete = async (key) => {
	try {
		const redis = await redisConnection();

		await redis.del(key);
        
		await redis.disconnect();

		return 'success';
	} catch (error) {
		winston.error(error);
		return null;
	}
};


/**
 * Keys
 * @param {string} key
 */
exports.keys = async (key) => {
	try {
		const redis = await redisConnection();

		var keys = await redis.keys(key);

		await redis.disconnect();

		// Converting to JSON Object
		try {
			keys = JSON.parse(keys);
		// eslint-disable-next-line no-empty
		} catch {}

		return keys;
	} catch (error) {
		winston.error(error);
		return null;
	}
};
