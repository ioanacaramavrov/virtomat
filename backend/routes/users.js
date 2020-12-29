const express  = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        fullName: req.body.displayName,
        email: req.body.email,
        password: hash
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

router.get('/:userId', (req, res, next) =>{
  const id = req.params.userId;
  User.findById(id)
    .select('_id fullName email')
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
          fullName: auth_user.fullName
       });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed!'
      });
    })
});
module.exports = router;
