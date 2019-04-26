const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')

// MAIN PAGE - Lists all the main posts
router.get('/', async (req, res, next) => {
	try{
		const allPosts = await Post.find({});
		res.render('posts/index.ejs', {
			posts: allPosts
		})
	}
	catch(err){
		next(err)
	}
})

// ROUTE TO THE POST CREATION PAGE
router.get('/new', (req, res, next) => {
	// ONLY Reachable if user id logged in
	if(req.session.loggedIn === true) {
		res.render('posts/new.ejs')
	} else {
		req.session.message = "must be logged in to contribute";
		res.redirect('/users/login')	
	}
})

// ROUTE TO POST NEW POSTS
router.post('/', async (req, res, next) => { 
	try {
		const foundUser = await User.findById(req.session.userId);
		const createdPost = await Post.create(req.body);
		foundUser.posts.push(createdPost);
		foundUser.save()
		res.redirect('/posts')
	}
	catch(err) {
		next(err)
	}
})

// SHOW PAGE FOR POSTS
router.get('/:id', async (req, res, next) => {
	try{
		// Returns one post from the specified user, 
		// that matches the parameters and puts it in an array.
		const foundUser = await User.findOne({'posts': req.params.id})
		.populate({path: 'posts', match: {_id: req.params.id}})
		console.log("\nfoundUser");
		console.log(foundUser);
		res.render('posts/show.ejs', {
			post: foundUser.posts[0],
			user: foundUser,
			session: req.session
		})
	}
	catch(err){
		next(err)
	}
})

// ROUTE to the post edit page
router.get('/:id/edit', async (req, res, next) => {
	const foundUser = await User.findOne({'posts': req.params.id})
	if(foundUser._id == req.session.userId){
		try{
			const foundPost = await Post.findOne({_id: req.params.id})
			res.render('posts/edit.ejs', {
				post: foundPost
			})
		}
		catch(err){
			next(err)
		}
	}
	else{
		res.redirect('/posts/' + req.params.id)
	}
})

// ROUTE for updating posts
router.put('/:id', async (req, res, next) => {
	try{
		const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.redirect('/posts/' + req.params.id)
	}
	catch(err){
		next(err)
	}
})

// DELETE ROUTE for posts
router.delete('/:id', async (req, res, next) => {
	try{
		const deletePost = await Post.deleteOne({_id: req.params.id})
		res.redirect('/posts')
	}
	catch(err){
		next(err)
	}
})

module.exports = router;