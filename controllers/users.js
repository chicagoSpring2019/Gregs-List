const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')



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
router.post('/register', async (req, res, next) => {
  try {
    const found = await User.findOne({'name': req.body.name})

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
      console.log(createdUser + "the created user! ");
      // they will be logged in (session)
      req.session.loggedIn = true 
      req.session.userIs = createdUser._id
      req.session.message = "Welcome to the site, " + createdUser.name
      // redirect them to /
      res.redirect('/posts/')
    }
  } catch(err) {
    next(err)
  }
})





router.post('/login', async (req, res) => {
  // Query the database to see if the user exists
  try {
    console.log(req.body);
    const foundUser = await User.findOne({'name': req.body.name});
    console.log(foundUser +
       "found user in login route");
    // Is foundUser a truthy value, if it is its the user object,
    // if we didn't find anything then foundUser === null a falsy value
    if(foundUser){
      console.log("test to see if foundUser = true");
      // since the user exist compare the passwords
      console.log(req.body.password + "< =-=-=-=- reqbody password");
      console.log(foundUser.password + "< =-=-=-=- f userss password");
      if(req.body.password === foundUser.password) {//bcrypt.compareSync(req.body.password, foundUser.password) === true){
        // set up the session
        console.log("\n \n testing if they are returning equal");
        req.session.message = '';
        req.session.logged = true;
        req.session.usersDbId = foundUser._id;
        console.log(req.session, " successful in login")
        res.redirect('/posts');

      } else {
        // redirect them back to the login with a message
        console.log(req.session.message);
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





router.get('/:id', async (req, res, next) => {
	try{
		const foundUser = await User.findById(req.params.id)
		console.log(foundUser + "<------ the found user in :id show")
		.populate({path: 'posts', match: {_id: req.params.id}})
			console.log(foundPosts + "<---- the retreieved posts");
			res.render('posts/show.ejs',{
				user: foundUser,
				post: foundUser.posts[0]
			})
		
	} catch(err) {
		next(err)
	}
})

module.exports = router;