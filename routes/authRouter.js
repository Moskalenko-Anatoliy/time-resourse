const Router = require('express');
const router = new Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);

router.get('/users', authMiddleware, authController.getUsers);

router.get('/token', authController.refreshAccessToken);

module.exports = router;


