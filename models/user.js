const mongoose = require('mongoose');
const Post = require('./post');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	description: String,
	email: {
		type: String, 
		required: true
	},
	phone: {
		type: Number, 
		sparse: true
	},
	linkedin: {
		type: String
	},
	posts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;