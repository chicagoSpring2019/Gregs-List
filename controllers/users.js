const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

///////////////// AUTH //////////////
//show login page
router.get('/login', async (req, res, next) => {
  const msg = req.session.message
  req.session.message = ''
  res.render('users/login.ejs', {
    message: msg,
    session: req.session
  });
});

//show register page
router.get('/register', (req, res, next) => {
  const msg = req.session.message
  req.session.message = ''
  res.render('users/new.ejs', {
    message: msg,
    session: req.session
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
    const foundName = await User.findOne({'name': req.body.name});
    const foundEmail = await User.findOne({'email': req.body.email});
    const foundPhone = await User.findOne({'phone': req.body.phone});
    const foundLinkedin = await User.findOne({'linkedin': req.body.linkedin});
    if (foundName) {
      req.session.message = "Username already taken."
      res.redirect('/users/register')
    }else if(foundEmail) {
      req.session.message = "Email already taken."
      res.redirect('/users/register')
    }else if(req.body.phone.length > 0 && foundPhone){
      req.session.message = "Phone Number already taken."
      res.redirect('/users/register')
    }else if(req.body.linkedin.length > 0 && foundLinkedin) {
      req.session.message = "linkedIn already taken."
      res.redirect('/users/register')
    } else {
      // create user
      const createdUser = await User.create(userDbEntry)
      // they will be logged in (session)
      req.session.loggedIn = true
      req.session.userId = createdUser._id
      req.session.name = req.body.name
      res.redirect('/posts/')
    }
  } catch (err) {
    next(err)
  }
});

// login as a user/ start session
router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({'name': req.body.name});
    if (foundUser) {
      if (bcrypt.compareSync(req.body.password, foundUser.password) === true) {
        req.session.message = '';
        req.session.loggedIn = true;
        req.session.userId = foundUser._id;
        req.session.name = req.body.name
        res.redirect('/posts');
      } else {
        req.session.message = "Username or Password is incorrect";
        res.redirect('/users/login');
      }
    } else {
      req.session.message = 'Username or Password is incorrect';
      res.redirect('/users/login');
    }
  } catch (err) {
    next(err);
  }
});

// logout as a user/ end session
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/users/login');
    }
  })
})
////////// ^^^^ AUTH ^^^ ///////////////

// USER profile show 
router.get('/:id', async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id).populate('posts')
    const msg = req.session.message
    req.session.message = ''
    res.render('users/show.ejs', {
      user: foundUser,
      posts: foundUser.posts,
      session: req.session,
      message: msg
    })
  } catch (err) {
    next(err)
  }
})

// route to user email message page
router.get('/:id/message', async (req, res, next) => {
  if(req.session.loggedIn === true) {
    try{
      const foundUser = await User.findById(req.params.id)
      res.render('users/message.ejs', {
        session: req.session,
        user: foundUser
      })
    }
    catch(err){
      next(err)
    }
  }
  else{
    req.session.message = "must be logged in to message";
    res.redirect('/users/login')
  }
})

//route to send email
router.post('/messages', async (req, res, next) => {
  try{
    const foundYou = await User.findById(req.session.userId)
    const foundUser = await User.findOne({'email': req.body.toEmail})
    let transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gregsListAuto@gmail.com',
        pass: 'pa$$w0rd!'
      }
    });
    let info = await transporter.sendMail({
      from: 'gregsListAuto@gmail.com',
      to: req.body.toEmail,
      subject: req.body.subject + ` sent from ${foundYou.name}`,
      text: req.body.text
    });
    req.session.message = "Email sent"
    res.redirect('/users/' + foundUser._id)
  }
  catch(err){
    next(err)
  }
})

//deletes user and all posts
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    const deletedUsersPosts = await Post.deleteMany({
      _id: {
        $in: deletedUser.posts
      }
    });
    req.session.destroy();
    res.redirect('/posts')
  } catch (err) {
    next(err);
  }
})

//shows user edit page
router.get('/:id/edit', async (req, res, next) => {
  const foundUser = await User.findById(req.params.id);
  if (foundUser._id == req.session.userId) {
    try {
      res.render('users/edit.ejs', {
        user: foundUser,
        session: req.session
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect('/users/' + req.params.id)
  }
});

//shows profile delete page
router.get('/:id/delete', async (req, res, next) => {
  const foundUser = await User.findById(req.params.id);
  if (foundUser._id == req.session.userId) {
    try {
      res.render('users/delete.ejs', {
        user: foundUser,
        session: req.session
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect('/users/' + req.params.id)
  }
});

// update the user
router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.redirect('/users/' + req.params.id)
  } catch (err) {
    next(err)
  }
})

module.exports = router;