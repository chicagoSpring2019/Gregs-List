const mongoose = require('mongoose');
const User = require('./user');
const Category = require('./category');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	image: String,
	description: {
		type: String.
		required: true
	},
	location: String,
	email: String,
	category: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	}]
});

const Post = mongoose.model('Post', postSchema);

module.exports = User;