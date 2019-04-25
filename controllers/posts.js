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
	console.log("hey here's the session");
	console.log(req.session);
	if(req.session.loggedIn === true) {
		res.render('posts/new.ejs')
	} else {
		req.session.message = "must be logged in to contribute";
		res.redirect('/users/register')	
	}
})

router.post('/', async (req, res) => { 
	console.log("hey hi hello");
	try {
		// write logic that if req.session.name is not a thing
		// or if req.session.loggedIn is not a thing or false
		//// disallow, 
		console.log("in the try boiiii!!!");
		console.log(req.params.id + "<======= reqparams");
		// otherwise
		const foundUser = await User.findOne({ _id: createdUser._id });
		console.log(createdUser._id);
		console.log(req.session);
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
	catch(err){
		res.send(err)
	}
})

router.get('/:id', async (req, res) => {
	try{
		const foundPost = await Post.findOne({_id: req.params.id})
		res.render('posts/show.ejs', {
			post: foundPost
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