const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')

router.get('/login', async (req, res) => {
	res.render('users/login.ejs');
});

router.get('/register', (req, res) => {
	res.render('users/new.ejs', {

	});	
});


module.exports = router;