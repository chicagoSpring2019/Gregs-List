const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	service: {
		type: String, 
		required: true
	},
	password: {
		type: String, 
		required: true
	},
	subject: {
		type: String, 
		required: true
	},
	text: {
		type: String, 
		required: true
	}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;