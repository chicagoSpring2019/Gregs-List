const mongoose = require('mongoose');
const Post = require('./post');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String
	},
	description: String,
	email: {
		type: String, 
		required: true
	},
	phone: {
		type: Number, 
	},
	linkedin: String,
	posts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}],
	googleId: {
		type: String,
		required: true
	},
	avatar: String
}, {
	timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;