const multer = require('multer');

exports.storage = multer.diskStorage({  
	destination: function (req, file, callback) {  
		callback(null, './images');  
	},  
	filename: function (req, file, callback) {  
		callback(null, file.originalname);  
	}  
});  

exports.upload = multer({ storage : this.storage }).array('image');
//.single('image'); 

///module.exports = storage;
