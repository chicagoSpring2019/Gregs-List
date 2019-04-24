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
	res.render('posts/new.ejs')
})

router.post('/', async (req, res) => {
	try{
		const createdPost = await Post.create(req.body);
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













module.exports = router;