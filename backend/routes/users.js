const express  = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        isEmployee: req.body.isEmployee,
        isAdmin: req.body.isAdmin,
        birthday: req.body.birthday,
        idPharmacy: req.body.idPharmacy,
        gender: req.body.gender
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });
    });
});
router.get('', (req, res, next) =>{
  User.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        users : docs
      })
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});
router.get('/isEmployee/:userId', (req, res, next) =>{
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
        res.status(200).json({
          isEmployee: user.isEmployee,
          isAdmin: user.isAdmin
        })
    })
    .catch(err =>{
      res.status(200).json({
        error:err
      })
    });

});
router.get('/idPharmacy/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      res.status(200).json({
        idPharmacy: user.idPharmacy
      })
    })
    .catch(err =>{
      res.status(200).json({
        error:err
      })
    });

});
router.get('/:userId', (req, res, next) =>{
  const id = req.params.userId;
  User.findById(id)
    .select('_id firstName lastName email')
    .then(user => {
      res.status(200).json({
          user: user
      })
    })
    .catch(err => {
      res.status(400).json({
        err: err
      })
    });
});
router.post('/login', (req,res,next) => {
 let auth_user;
  User.findOne({ email: req.body.email })
    .then(user =>{
        if(!user) {
          return res.status(401).json({
              message: 'Auth failed!'
          });
        }
        auth_user = user;
        if(req.body.isEmployee || user.isEmployee)
         return bcrypt.compare(req.body.password, user.password) && user.isEmployee && req.body.isEmployee;
        else
          return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Auth failed!'
        });
      }
      const token = jwt.sign({email: auth_user.email, userId: auth_user._id},  'private_secret_key_for_token_use',
        {expiresIn:'1h'});
       res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: auth_user._id,
          isAdmin: auth_user.isAdmin,
          isEmployee: auth_user.isEmployee
       });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed!'
      });})});

router.get('/bi/clienti', (req, res, next) =>{
  User.find()
    .select('_id firstName lastName email birthday gender')
    .where('isEmployee').equals('false')
    .exec()
    .then(docs => {
      res.status(200).json({
        clienti : docs
      })
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});

router.get('/bi/farmacisti', (req, res, next) =>{
  User.find()
    .select('_id firstName lastName email birthday idPharmacy gender')
    .where('isEmployee').equals('true')
    .exec()
    .then(docs => {
      res.status(200).json({
        farmacisti : docs
      })
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});
module.exports = router;
