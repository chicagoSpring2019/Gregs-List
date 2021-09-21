const express        = require('express');
const app            = express();
const methodOverride = require('method-override');
const session        = require('express-session');

require('dotenv').config()

const PORT = process.env.PORT

require('./db/db')

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false
}));

app.get('/', (req, res) => {
	res.redirect('/posts')
})
 
//controllers
const usersController  = require('./controllers/users');
app.use('/users', usersController);

const postsController = require('./controllers/posts');
app.use('/posts', postsController);

//listener
app.listen(PORT, () => {
  console.log('listening... on port: ', PORT);
});
