const jwt = require('jsonwebtoken');
const { secretToken } = require('../config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {       
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({message: ' не авторизован!'})
    }    
    const decodedData = jwt.verify(token, secretToken);        
    req.userId = decodedData.userId;
    next();    
  } catch(err) {     

     if (err.name === "TokenExpiredError") {      
      console.log('Cookie: ', req.cookies.refreshToken)
     }
     
    res.status(403).json({message: ' не авторизован!'})
  }
}
