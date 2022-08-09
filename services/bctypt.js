const bcrypt = require('bcryptjs');

bcrypt.hash("1165tma!#", 10, (err, hash) => {
  console.log(hash)
})