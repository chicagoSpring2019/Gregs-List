const mongoose = require('mongoose');
const Post = require('./post');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	description: String,
	email: {
		type: String, 
		required: true,
		unique: true
	},
	phone: {
		type: Number, 
		unique: true
	},
	linkedin: {
		type: String, 
		unique: true
	},
	posts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;