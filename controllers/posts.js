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