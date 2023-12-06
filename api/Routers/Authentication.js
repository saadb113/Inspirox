const jwt = require('jsonwebtoken');
const secretKey = 'saadbhaizindabaad1';
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" }); // Invalid token
      }
  
      req.user = user; // Attach the user object to the request
      next(); // Continue to the next middleware or route
    });
  }

  module.exports = authenticateToken