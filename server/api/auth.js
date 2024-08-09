const jwt = require('jsonwebtoken');

const SECRET_KEY = 'hardcodedlol';

function checkToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'You need to login first' });
  }

  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  });
}

module.exports = checkToken;