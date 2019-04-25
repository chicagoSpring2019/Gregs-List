const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')

///////////////// AUTH //////////////

router.get('/login', async (req, res) => {
	res.render('users/login.ejs');
});

router.get('/register', (req, res) => {
	const msg = req.session.message
	req.session.message = ''
	res.render('users/new.ejs', {
    message: msg
	});	
});



/// REGISTER ROUTE ///
router.post('/register', async (req, res) => {
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

    console.log("\nhere is found:");
    console.log(found);

    // if that name is already taken
    if(found) {
      req.session.message = "Username already taken."
      // redirect to register page with a message
      res.redirect('/users/register')
    }
    // else
    else {
      // create user
      const createdUser = await User.create(userDbEntry)
      console.log(createdUser + "the created user! ");
      // they will be logged in (session)
      req.session.loggedIn = true 
      req.session.userId = createdUser._id
      req.session.message = "Welcome to the site, " + createdUser.name
      // redirect them to /
      res.redirect('/posts/')
    }
  } catch(err){
      res.send(err)
    }
});





router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({'name': req.body.name});
    if(foundUser){
      if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
        req.session.message = '';
        req.session.loggedIn = true;
        req.session.userId = foundUser._id;
        res.redirect('/posts');
      } else {
        req.session.message = "Username or password is incorrect";
        res.redirect('/users/login');
      }
    } else {
      req.session.message = 'Username or Password is incorrect';
      res.redirect('/users/login');
    }
  } catch(err){
    res.send(err);
  }
});


router.get('/logout', (req, res) => {
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
		console.log(foundUser + "<------ the found user in :id show");
			console.log("<---- the retreieved posts");
		
			res.render('users/show.ejs',{
				user: foundUser,
				posts: foundUser.posts
			})
		
	} catch(err) {
		next(err)
	}
})

/// ONLy make possible if you are the logged in user ///
///
//
router.delete('/:id', async (req, res) => {
  try{
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    const deletedUsersPosts = await Post.deleteMany({_id: {$in: deletedUser.posts}});
    res.redirect('/posts')
  }  
  catch(err) {
    res.send(err);
  }
})

/// ONLy make possible if you are the logged in user ///
///
//
router.get('/:id/edit', async (req, res) => {
  try {
    console.log("\n This be the try ");
    const foundUser = await User.findById(req.params.id);
    console.log("\n the user has been found:", foundUser);
    res.render('users/edit.ejs', {
      user: foundUser
    });
  }
  catch(err) {
    res.send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/users/' + req.params.id)
  }  
  catch(err) {
    res.send(err)
  }
})





module.exports = router;