const express = require('express');
const router = express.Router();
const tasks = require('../../services/tasks');

/* GET tasks */
router.get('/', async function(req, res, next) {
  try {
    res.json(await tasks.getTaskList(3));
  } catch (err) {
    console.error(`Error while getting tasks `, err.message);
    next(err);
  }
});

module.exports = router;