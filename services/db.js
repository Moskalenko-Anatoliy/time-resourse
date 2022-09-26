const mysql = require('mysql2');
const { Client } = require('ssh2');
const {dbServer, tunnelConfig, forwardConfig} = require('../config');


async function query(sql, params) {
  const sshClient = new Client();

  const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', async () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) {
                console.log(err);
                reject(err);
             }           
             const updatedDbServer = {
                 ...dbServer,
                 stream
             };
            
            const connection = mysql.createConnection(updatedDbServer);            
            connection.connect((error) => {
              if (error) {
                  console.log(error);
                  reject(error);
              }              
              resolve(connection);
            });            
  
        });
    }).connect(tunnelConfig);
  });

  
  return SSHConnection
    .then(async (connection) => {      
      const [results, ] = await connection.promise().query(sql, params);
      connection.end();
      return results;
    })
    .catch(error => {
      console.error(error);
      connection.end();
    });
}

module.exports = {
  query
}
