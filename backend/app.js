const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const app = express();
const server = require('http').createServer(app);

mongoose.set('useCreateIndex', true);
mongoose.connect('mmongodb+srv://ruxandra:ruxandra@pharmacy-app.khfc8.mongodb.net/ai?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
  .then (()=>{
  console.log('Connected to database!');
  })
  .catch((err) =>{
    console.log(err);
  });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next)=> {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    return res.status(200).json({});
  }
  next();
});

//Middleware ca
app.use('/api/users', userRoutes);

app.use((req,res,next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req,res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message:error.message
    }
  });
});


module.exports = app;
