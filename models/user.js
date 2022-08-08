const crud = require('../services/db');

class User {    
  async findByLogin(login) {
    try {
      const row = await crud.query(
        `
          SELECT
            employee.id as id, tmaUsers.hash as hash
          FROM employee
            left join tmaUsers on employee.user = tmaUsers.id
          WHERE
            tmaUsers.login  = ?
          LIMIT 1
        `,
        [login]
      );
      return row;
    } catch (err) {
      console.log(err)
    }
    
  }
}

module.exports = new User();


  