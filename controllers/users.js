const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')

router.get('/login', async (req, res) => {
	res.render('users/login.ejs');
});

router.get('/register', (req, res) => {
	const msg = req.session.message
	req.session.message = ''
	res.render('users/new.ejs', {
	});	
});

router.post('/register', async (req, res, next) => {

  try {
    // find the user -- to see if they exist
    const found = await User.findOne({username: req.body.username})

    console.log("\nhere is found:");
    console.log(found);

    // if that name is already taken
    if(found !== null) {
      req.session.message = "Username already taken."
      // redirect to register page with a message
      res.redirect('/users/register')
    }
    // else
    else {
      // create user
      const createdUser = await User.create(req.body)
      // they will be logged in (session)
      req.session.loggedIn = true 
      req.session.username = createdUser.username
      req.session.message = "Welcome to the site, " + createdUser.username
      // redirect them to /
      res.redirect('/posts/')
    }

  } catch(err) {
    next(err)
  }

})

module.exports = router;