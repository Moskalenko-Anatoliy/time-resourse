const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretToken } = require('../config');

function generateAccessToken(userId) {  
  return jwt.sign({    
    userId    
  }, secretToken, { expiresIn: '15s' });  
}

function generateRefreshToken(userId) {  
  return jwt.sign({    
    userId    
  }, secretToken, { expiresIn: '24h' });  
}


class authController {

  async login(req, res) {
    try {                  
      const {login, password} = req.body;                

      const user = await User.findByLogin(login);        
      
      if (user.length === 0) {
        return res.status(200).json('Такого логина нет в систем');    
      }
            
      if ( bcrypt.compareSync(password, user[0].hash) === false ) {
        return res.status(200).json('Пароль не верный');        
      }      

      const accessToken = generateAccessToken(user[0].id);
      
      const refreshToken = generateRefreshToken(user[0].id);   
      
      if (refreshToken) {
        await User.updateRefreshToken(user[0].id, refreshToken)
      }
      
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true
        })
        .json({
        accessToken        
      });
                  
    } catch(err) {      
      console.log(err);
      return res.status(400).json({'message': err})
    };
  };

  async getUsers(req, res) {
    try {           
      res.json(req.user);
    } catch(e) {
      res.status(400).json({'message': 'Ошибка поиска пользователя!'})
    };        
  };

  async refreshAccessToken(req, res) {    
    try {
      const refreshToken = req?.cookies?.refreshToken;      

      if (!refreshToken) {
        res.status(401).json({messsage: "Необходимо перелогиниться (отсутствуют токен обновления)"})        
      }

      if (!refreshToken) {
        res.status(401).json({messsage: "Необходимо перелогиниться (отсутствуют токен обновления)"})
      }

      const decodedData = jwt.verify(refreshToken, secretToken);   
      const tokenExists = User.checkRefreshToken(decodedData.userId, refreshToken);
      if (!tokenExists) {
        res.status(401).json({messsage: "Необходимо перелогиниться (токен обновления не валидный)"})        
      }
      const newRefreshToken = generateRefreshToken(decodedData.userId);

      const newAccessToken = generateAccessToken(decodedData.userId);
      User.updateRefreshToken(decodedData.userId, newRefreshToken);

      return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true
        })
        .json({
        accessToken: newAccessToken        
      });      
    } catch(e) {
      console.log(e.name);
      console.log(e.message);         
    }

  }
}

module.exports = new authController();