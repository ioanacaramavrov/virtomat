const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const pharmacyRoutes = require('./routes/pharmacies');
const historyRoutes = require('./routes/histories');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('./routes/notification')(io);

//Morgan este folosit pentru a face logs de aceea trebuie pus inaintea de request-uri
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://ruxandra:ruxandra@pharmacy-app-khfc8.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
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
app.use('/api/products', productRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/history', historyRoutes);

//Aici facem handle la toate request-urile care ajung aici pentru ca accest lucru inseamna ca nu tine nici de products si nici de reservation


app.use((req,res,next) => {
  const error = new Error('Not found');
  error.status = 404;
  //Forward the request but not the original one, the one containing the error
  next(error);
});
//Pentru celelate request-uri care nu au 404

app.use((error, req,res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message:error.message
    }
  });
});


module.exports = app;
