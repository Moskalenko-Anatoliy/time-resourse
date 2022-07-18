const User = require('../models/user')

class authController {
  async registration(req, res) {
    try {

    } catch(e) {
      res.status(400).json({'message': 'Ошибка регистрации'})
    };
  };

  async login(req, res) {
    try {

    } catch(e) {
      res.status(400).json({'message': 'Логин или пароль неверный!'})
    };
  };

  async getUsers(req, res) {
    try {        
      res.json(await User.findByLogin('tolik'));
    } catch(e) {
      res.status(400).json({'message': 'Ошибка поиска пользователя!'})
    };        
  };
}

module.exports = new authController();