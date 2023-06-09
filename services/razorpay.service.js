const winston = require('winston');
const Razorpay = require('razorpay');
const SECRETS = require('../config/secrets');


const instance = new Razorpay({
	key_id: SECRETS.RAZORPAY_KEY_ID,
	key_secret: SECRETS.RAZORPAY_KEY_SECRET,
});


exports.createOrder = async (amount, currency, receipt, notes = '') => {

	try {
		if (!amount || !currency || !receipt) return null;

		amount = Number(amount);

		var options = {
			amount: Number((amount * 100).toFixed(0)),
			currency: currency,
			receipt: receipt,

			// Transfers Disabled for now
			// transfers: [
			// 	{
			// 		account: accountId.trim(),
			// 		amount: Number(((amount - lookoduCharges) * 100).toFixed(0)), // amount in the smallest currency unit
			// 		currency: 'INR',
			// 		// notes: {
			// 		//     branch: "Acme Corp Bangalore North",
			// 		//     name: "Gaurav Kumar"
			// 		// },
			// 		// linked_account_notes: [
			// 		//     "branch"
			// 		// ],
			// 		on_hold: 0,
			// 		// on_hold_until: Math.floor((new Date().setDate(new Date().getDate() + 2)) / 1000)
			// 	}
			// ],

			// payment: {
			// 	capture : 'automatic',
			// 	capture_options : {
			// 		automatic_expiry_period : 7200, // Minutes - 5 days
			// 		// manual_expiry_period : 7200, // Optional (default: 7200)
			// 		refund_speed : 'normal'
			// 	}
			// }
		};

		try {
			var order = await instance.orders.create(options);
		} catch(error) {
			winston.error('Error in RazorPay Order Creation', error);
			return null;
		}

		return order;

	} catch (error) {
		winston.error(`Create Order Service Error ${error.message}`);
	}
};