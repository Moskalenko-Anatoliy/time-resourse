const express = require('express');
const router = express.Router();
const tasks = require('../controller/taskListController');
const authMiddleware = require('../middleware/authMiddleware');

/* GET tasks */

router.get('/:taskId', authMiddleware, tasks.getTask);

router.get('/', authMiddleware, tasks.getTaskList);


module.exports = router;