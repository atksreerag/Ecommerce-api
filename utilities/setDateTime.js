const winston = require('winston');


/**
 * Set time - 00:00 to StartDate (MidNight)
 * @param {Date} date 
 * @returns 
 */
exports.setStartDateTime = async (date) => {
	try {
		if (!date) return null;

		let convertedDate = new Date(date + ' 00:00:00');
		if (isNaN(convertedDate.getTime())) return date;

		return convertedDate;

	} catch (error) {
		winston.error(error);
		return date;
	}

};


/**
 * Set time - 23:59 to EndDate (MidNight)
 * @param {Date} date 
 * @returns 
 */
exports.setEndDateTime = async (date) => {
	try {
		if (!date) return null;

		let convertedDate = new Date(date+ '23:59:59');
		if (isNaN(convertedDate.getTime())) return date;
		return convertedDate;
	} catch (error) {
		winston.error(error);
		return date;
	}
};