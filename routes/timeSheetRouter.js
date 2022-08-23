const express = require('express');
const router = express.Router();
const timeSheetController = require('../controller/timeSheetController');
const authMiddleware = require('../middleware/authMiddleware');

/* GET tasks */

router.get('/get', authMiddleware, timeSheetController.getTimeSheetId);

router.post('/create', authMiddleware, timeSheetController.createTimeSheet.bind(timeSheetController));

router.get('/info/get', authMiddleware, timeSheetController.getTimeSheetDetail);


module.exports = router;