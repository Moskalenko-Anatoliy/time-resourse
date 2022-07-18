const express = require('express');
const router = express.Router();
const tasks = require('../controller/taskListController');

/* GET tasks */
router.get('/', tasks.getTaskList);

module.exports = router;