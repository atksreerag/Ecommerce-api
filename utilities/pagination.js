const winston = require('winston');


/**
 * Pagination - append count, pages, next, previous to Response object
 * @param {object} response
 * @param {number} total_count
 * @param {number} page_limit
 * @param {number} current_page
 */
module.exports = (response, total_count, page_limit, current_page = 1) => {
	try {
		const total_pages = total_count <= page_limit ? 1 : Math.ceil( total_count / page_limit );

		response.data.count = total_count;
		response.data.pages = total_pages;

		// Calculating Next Page Number
		if (current_page < total_pages) {
			response.data.next = current_page + 1;
		} else {
			response.data.next = null;
		}

		// Calculating Previous Page Number
		if (current_page > 1) {
			if (current_page <= total_pages) {
				response.data.previous = current_page - 1;
			} else {
				response.data.previous = total_pages;
			}
		} else {
			response.data.previous = null;
		}

		return response;
	} catch(error) {
		winston.error('Pagination function error', error);
		return null;
	}
};
