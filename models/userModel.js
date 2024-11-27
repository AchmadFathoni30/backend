const { poolPromise, sql } = require('../config/database.js');

const getUserByNik = async (nik) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nik', sql.VarChar, nik)
      .query('SELECT * FROM users WHERE nik = @nik');
    
    return result.recordset[0];
  } catch (error) {
    console.error('Error fetching user by NIK:', error.message);
    throw error;
  }
};

const createUser = async (nik, name, email, hashedPassword, position) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nik', sql.VarChar, nik)
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('position', sql.VarChar, position)
      .query('INSERT INTO users (nik, name, email, password, position) VALUES (@nik, @name, @email, @password, @position)');
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

module.exports = {
  getUserByNik,
  createUser
};
