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
		type: String
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
		type: String
	},
	avatar: String
}, {
	timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;