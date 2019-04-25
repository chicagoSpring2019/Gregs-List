const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')

// MAIN PAGE - Lists all the main posts
router.get('/', async (req, res) => {
	try{
		const allPosts = await Post.find({});
		res.render('posts/index.ejs', {
			posts: allPosts
		})
	}
	catch(err){
		res.send(err)
	}
})

// ROUTE TO THE POST CREATION PAGE
router.get('/new', (req, res) => {
	// ONLY Reachable if user id logged in
	if(req.session.loggedIn === true) {
		res.render('posts/new.ejs')
	} else {
		req.session.message = "must be logged in to contribute";
		res.redirect('/users/register')	
	}
})

// ROUTE TO POST NEW POSTS
router.post('/', async (req, res) => { 
	try {
		const foundUser = await User.findById(req.session.userId);
		const createdPost = await Post.create(req.body);
		foundUser.posts.push(createdPost);
		foundUser.save()
		res.redirect('/posts')
	}
	catch(err) {
		res.send(err)
	}
})

// SHOW PAGE FOR POSTS
router.get('/:id', async (req, res) => {
	try{
		// Returns one post from the specified user, 
		// that matches the parameters and puts it in an array.
		const foundUser = await User.findOne({'posts': req.params.id})
		.populate({path: 'posts', match: {_id: req.params.id}})
		res.render('posts/show.ejs', {
			post: foundUser.posts[0],
			user: foundUser
		})
	}
	catch(err){
		res.send(err)
	}
})

// ROUTE to the post edit page
router.get('/:id/edit', async (req, res) => {
	try{
		const foundPost = await Post.findOne({_id: req.params.id})
		res.render('posts/edit.ejs', {
			post: foundPost
		})
	}
	catch(err){
		res.send(err)
	}
})

// ROUTE for updating posts
//
///////// add in original poster edit functionality ///////////
//
router.put('/:id', async (req, res) => {
	try{
		const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.redirect('/posts/' + req.params.id)
	}
	catch(err){
		res.send(err)
	}
})

// DELETE ROUTE for posts
//
///////// add in original poster edit functionality ///////////
//
router.delete('/:id', async (req, res) => {
	try{
		const deletePost = await Post.deleteOne({_id: req.params.id})
		res.redirect('/posts')
	}
	catch(err){
		res.send(err)
	}
})

module.exports = router;