const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')

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

router.get('/new', async (req, res) => {
	if(req.session.loggedIn === true) {
		res.render('posts/new.ejs')
	} else {
		req.session.message = "must be logged in to contribute";
		res.redirect('/users/register')	
	}
})

router.post('/', async (req, res) => { 
	try {
		// write logic that if req.session.name is not a thing
		// or if req.session.loggedIn is not a thing or false
		//// disallow, 
		console.log(req.session + ' This is the session');
		console.log(req.session.userId);
		const foundUser = await User.findById(req.session.userId);
		console.log(foundUser);
		const createdPost = await Post.create(req.body);
		console.log(createdPost + "<--- created post");
		console.log(foundUser + "<---- the found user before its pushed");
		foundUser.posts.push(createdPost);
		console.log(foundUser + "cl after push but before save");
		console.log(foundUser.posts);
		foundUser.save()
		console.log(foundUser + "<---- the found user");
		res.redirect('/posts')
	}
	catch(err) {
		res.send(err)
	}
})


// POST SHOW
router.get('/:id', async (req, res) => {
	try{
		// Returns one post from the specified user, that matches the parameters and puts it in an array.
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

router.put('/:id', async (req, res) => {
	try{
		const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.redirect('/posts/' + req.params.id)
	}
	catch(err){
		res.send(err)
	}
})

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