const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: '127.0.0.1',
  port: 1439, // Use a separate 'port' field instead of embedding it in 'server'
  database: 'ApprovalDB',
  options: {
    encrypt: false, // Set to true if you are using Azure or need encrypted connections
    enableArithAbort: true,
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed!', err);
    process.exit(1); // Exit the process if the connection fails
  });

module.exports = { sql, poolPromise };
