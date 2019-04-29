const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session');

require('./db/db')

//controllers
const usersController  = require('./controllers/users');
const postsController = require('./controllers/posts');

//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'This is a random secret string that you would make up to protect your session',
  resave: false, 
  saveUninitialized: false
}));

app.get('/', (req, res) => {
	res.redirect('/posts')
})

//controllers
app.use('/users', usersController);
app.use('/posts', postsController);

//listener
app.listen(3000, () => {
  console.log('listening... on port: ', 3000);
});
