const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //The split login is for bearer 104 tutorial
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'private_secret_key_for_token_use');
    next();
  } catch(error) {
    res.status(401).json({message: 'Auth failed'});
  }
};
