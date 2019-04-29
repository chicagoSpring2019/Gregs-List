const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')

// MAIN PAGE - Lists all the main posts
router.get('/', async (req, res, next) => {

	try{
		const allPosts = await Post.find({});
		allPosts.sort(function(a,b){
  			return new Date(b.date) - new Date(a.date);
		});
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
router.get('/new', (req, res, next) => {
    // ONLY Reachable if user id logged in
    if (req.session.loggedIn === true) {
        res.render('posts/new.ejs', {
            session: req.session
        })
    } else {
        req.session.message = "must be logged in to contribute";
        res.redirect('/users/login')
    }
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
		const foundUser = await User.findById(req.session.userId);
		const postDbEntry = {};
		postDbEntry.title = req.body.title
		postDbEntry.image = req.body.image
		postDbEntry.description = req.body.description
		postDbEntry.location = req.body.location
		postDbEntry.email = req.body.email
		postDbEntry.category = req.body.category
		postDbEntry.time = req.body.time
		postDbEntry.date = Date.now();
		const createdPost = await Post.create(postDbEntry);
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
		.populate({path: 'posts', match: {_id: req.params.id}});
		const foundYou = await User.findById(req.session.userId);
		res.render('posts/show.ejs', {
			post: foundUser.posts[0],
			user: foundUser,
			session: req.session,
			you: foundYou
		})
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
router.get('/:id/edit', async (req, res, next) => {
	const foundUser = await User.findOne({'posts': req.params.id})
	if(foundUser._id == req.session.userId){
		try{
			const foundPost = await Post.findOne({_id: req.params.id})
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

// ROUTE for updating posts
router.put('/:id', async (req, res, next) => {
	if (req.session.loggedIn === true) {
	  try {
	  	const foundPost = await Post.findById(req.params.id);
	  	const double = foundPost.attendance.includes(req.session.id)
	  	console.log(foundPost.attendance[0]);
	  	console.log(req.session.userId);
	  	console.log(double);
	  	if(double === false){
		  	foundPost.attendance.push(req.session.userId);
		  	foundPost.save();
		  }
		  else{
		  	req.session.message = 'You have already RSVPed'
		  	res.redirect('/posts/' + req.params.id)
		  }
	    const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
	    res.redirect('/posts/' + req.params.id)
	  } catch (err) {
	    next(err)
	  }
	}
	else{
		req.session.message = 'Must be logged in to mark going'
		res.redirect('/users/login')
	}
})

// DELETE ROUTE for posts
router.delete('/:id', async (req, res, next) => {
    try {
        const deletePost = await Post.deleteOne({
            _id: req.params.id
        })
        res.redirect('/posts')
    } catch (err) {
        next(err)
    }
})

module.exports = router;