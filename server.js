const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session');
require('./db/db')

const usersController  = require('./controllers/users');
const postsController = require('./controllers/posts');
//const categoriesController     = require('./controllers/categoriesController');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'This is a random secret string that you would make up to protect your session',
  resave: false, 
  saveUninitialized: false
}));


// app.use((req, res, next) => {

// })


app.use('/users', usersController);
app.use('/posts', postsController);
//app.use('/categories', categoriesController);


app.listen(3000, () => {
  console.log('listening... on port: ', 3000);
});
