const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const isLoggedIn = require('../config/auth')

// MAIN PAGE - Lists all the main posts
router.get('/', async (req, res, next) => {
	try{
		const allPosts = await Post.find({});
		// allPosts.sort(function(a,b){
  		// 	return new Date(b.date) - new Date(a.date);
		// });
		// res.send(allPosts)
		res.render('posts/index.ejs', {
			posts: allPosts,
			session: req.session
		})
	}
	catch(err){
		next(err)
	}
})

// ROUTE TO THE POST CREATION PAGE
router.get('/new', isLoggedIn, (req, res, next) => {
  // ONLY Reachable if user id logged in
    res.render('posts/new.ejs', {
      session: req.session
    })
})

//routes for categories
router.get('/hire', (req, res, next) => {
	res.render('categories/newHire.ejs', {
		session: req.session
	})
})
router.get('/job', (req, res, next) => {
	res.render('categories/newJob.ejs', {
		session: req.session
	})
})
router.get('/meet', (req, res, next) => {
	res.render('categories/newMeet.ejs', {
		session: req.session
	})
})

// ROUTE TO POST NEW POSTS
router.post('/', async (req, res, next) => { 
	try {
		let foundUser
		if(req.user){
			console.log('if req.user')
			foundUser = await User.findById(req.user._id);
		}else if(req.session){
			console.log(req.session)
			foundUser = await User.findById(req.session.userId);
		}
		console.log(foundUser)
		const createdPost = await Post.create(req.body);
		foundUser.posts.push(createdPost);
		foundUser.save()
		console.log(foundUser)
		// res.redirect('/posts')
		res.send(createdPost)
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
		.populate({path: 'posts', match: {_id: req.params.id}});
		const msg = req.session.message
    req.session.message = ''
    console.log(req.session);
		res.send(foundUser.posts[0])
		// res.render('posts/show.ejs', {
		// 	post: foundUser.posts[0],
		// 	foundUser: foundUser,
		// 	session: req.session,
		// 	message: msg,
		// })
	}
	catch(err){
		next(err)
	}
})

//route for users attending an event
router.get('/:id/attendance', async (req, res, next) => {
	try{
		const foundPost = await Post.findById(req.params.id).populate('attendance')
		res.render('posts/attendance.ejs', {
			users: foundPost.attendance,
			session: req.session
		})
	}
	catch(err){
		next(err)
	}
})

// ROUTE to the post edit page
router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
	const foundUser = await User.findOne({'posts': req.params.id})
	if(foundUser._id == req.user._id){
		try{
			const foundPost = await Post.findOne({_id: req.params.id})
			res.send(foundPost)
			if(foundPost.category === 'Hire'){
				res.render('categories/editHire.ejs', {
					post: foundPost,
					session: req.session
				})
			}
			else if(foundPost.category === 'Job'){
				res.render('categories/editJob.ejs', {
					post: foundPost,
					session: req.session
				})
			}
			else if(foundPost.category === 'Meet'){
				res.render('categories/editMeet.ejs', {
					post: foundPost,
					session: req.session
				})
			}
		}
		catch(err){
			next(err)
		}
	}
	else{
		res.redirect('/posts/' + req.params.id)
	}
})

//route for marking going to event
router.put('/:id/going', isLoggedIn, async (req, res, next) => {
	  try {
	  	let attendanceCompare = false
	  	const foundPost = await Post.findById(req.params.id);
	  	for(let i = 0; i < foundPost.attendance.length; i++) {
	  		if(foundPost.attendance[i] == req.user._id){
	  			attendanceCompare = true
	  			req.session.message = 'You are already on the list'
	  			res.redirect('/posts/' + req.params.id)
	  		} 
	  	}
	  	if(!attendanceCompare) {
			  foundPost.attendance.push(req.user._id);
			  foundPost.save();
			  req.session.message = 'You have been added to the list'
			  res.redirect('/posts/' + req.params.id)
	  	}
	  } catch (err) {
	    next(err)
	  }
})

// ROUTE for updating posts
router.put('/:id', async (req, res, next) => {
	const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
	res.redirect('/posts/' + req.params.id)
})

// DELETE ROUTE for posts
router.delete('/:id', async (req, res, next) => {
  try {
    const deletePost = await Post.deleteOne({ _id: req.params.id});
    res.redirect('/posts')
  } catch (err) {
    next(err)
  }
})

module.exports = router;