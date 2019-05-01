const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/gregs-list15';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('connected', () => {
  console.log('mongoose connected to ', connectionString);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected to ', connectionString);
});

mongoose.connection.on('error', (error) => {
  console.log('mongoose error ', error);
});
