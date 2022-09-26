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
      console.log("row", row)
      return row;
    } catch (err) {
      console.log(err)
    }
    
  }

  async checkRefreshToken(userId, RefreshToken) {
    try {        
      const tokenExists = await crud.query(
        `
          select 
            id  
          from tmaUsers
          WHERE
            id  = ${userId} and refreshToken = "${RefreshToken}"
          limit 1
        `      
      );
      
      return tokenExists ? true : false
    } catch (err) {
      console.log(err)
    }    
  }  

  async updateRefreshToken(userId, newRefreshToken) {
    try {        
      await crud.query(
        `
          update 
            tmaUsers
          Set 
            tmaUsers.refreshToken = "${newRefreshToken}"  
          WHERE
            id  = ${userId}          
        `      
      );
      return true
    } catch (err) {
      console.log(err)
    }    
  }
}

module.exports = new User();


  