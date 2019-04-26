const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')

///////////////// AUTH //////////////
//show login page
router.get('/login', async (req, res, next) => {
  const msg = req.session.message
  req.session.message = ''
	res.render('users/login.ejs', {
    message: msg
  });
});

//show register page
router.get('/register', (req, res, next) => {
	const msg = req.session.message
	req.session.message = ''
	res.render('users/new.ejs', {
    message: msg
	});	
});

/// create new user from register page ///
router.post('/register', async (req, res, next) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
    userDbEntry.name = req.body.name
    userDbEntry.password = passwordHash
    userDbEntry.description = req.body.description
    userDbEntry.email = req.body.email
    userDbEntry.phone = req.body.phone
    userDbEntry.linkedin = req.body.linkedin 
  try {
    const found = await User.findOne({'name': req.body.name})
    // if that name is already taken
    if(found) {
      req.session.message = "Username already taken."
      // redirect to register page with a message
      res.redirect('/users/register')
    }
    else {
      // create user
      const createdUser = await User.create(userDbEntry)
      // they will be logged in (session)
      req.session.loggedIn = true 
      req.session.userId = createdUser._id
      res.redirect('/posts/')
    }
  } catch(err){
      next(err)
    }
});

// login as a user/ start session
router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({'name': req.body.name});
    if(foundUser){
      if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
        req.session.message = '';
        req.session.loggedIn = true;
        req.session.userId = foundUser._id;
        console.log(req.session);
        res.redirect('/posts');
      } else {
        req.session.message = "Username or Password is incorrect";
        res.redirect('/users/login');
      }
    } else {
      req.session.message = 'Username or Password is incorrect';
      res.redirect('/users/login');
    }
  } catch(err){
    next(err);
  }
});

// logout as a user/ end session
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/users/login');
    }
  })
})
////////// ^^^^ AUTH ^^^ ///////////////

// USER profile show 
router.get('/:id', async (req, res, next) => {
  try{
  	const foundUser = await User.findById(req.params.id).populate('posts')
  	res.render('users/show.ejs',{
  		user: foundUser,
  		posts: foundUser.posts,
      session: req.session
  	})	
  } 
  catch(err){
  	next(err)
  }
})

//deletes user and all posts
router.delete('/:id', async (req, res, next) => {
  try{
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    const deletedUsersPosts = await Post.deleteMany({_id: {$in: deletedUser.posts}});
    res.redirect('/posts')
  }  
  catch(err) {
    next(err);
  }
})

//shows user edit page
router.get('/:id/edit', async (req, res, next) => {
  const foundUser = await User.findById(req.params.id);
  if(foundUser._id == req.session.userId){
    try {
      res.render('users/edit.ejs', {
        user: foundUser
      });
    }
    catch(err) {
      next(err);
    }
  }
  else{
    res.redirect('/users/' + req.params.id)
  }
});

// update the user
router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/users/' + req.params.id)
  }  
  catch(err) {
    next(err)
  }
})

module.exports = router;