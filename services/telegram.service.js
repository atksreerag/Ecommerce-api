const axios = require('axios');
const winston = require('winston');
const SECRETS = require('../config/secrets');


/**
 * Telegram notification  
 * @param {string} message 
 * @param {string} group  
 */
module.exports = async (message) => {
	try {
		if (!message) return null;

		const apiKey = SECRETS.TELEGRAM_API_KEY;

		let data = {};
		data['chat_id'] = SECRETS.TELEGRAM_CHAT_ID;

		// eslint-disable-next-line no-constant-condition
		while (true) {
			
			if (message.length > 3999) {
				data['text'] = message.substring(0, 3999);
				message = message.substring(3999);

				await axios.post(`https://api.telegram.org/bot${apiKey}/sendMessage`, data);
			} else if(message.length > 0) {
				data['text'] = message;

				axios({
					method: 'post',
					url: `https://api.telegram.org/bot${apiKey}/sendMessage`,
					data: data,
				});
				break;
			} else break;
		}

		return 'success';
	} catch (error) {
		winston.error('Telegram Service Error', error.message);
		return null;
	}
};
