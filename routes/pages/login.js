const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {  
  try {

  }
  catch(err) {
    next(err)
  }
  res.sendFile(path.join(__dirname, '/public/html/login.html'));
});

module.exports = router;