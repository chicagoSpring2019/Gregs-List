const mongoose = require('mongoose');
const User = require('./user');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	image: String,
	description: {
		type: String,
		required: true
	},
	location: String,
	email: String,
	category: {
		type: String, 
		required: true
	},
	date: {
		type: Date, 
		required: true
	},
	time: Date,
	attendance: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;