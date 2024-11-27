const { poolPromise, sql } = require('../config/database.js');

/**
 * Fetch a user by NIK
 * @param {string} nik 
 * @returns {object|null} 
 */
const getUserByNik = async (nik) => {
  if (!nik) {
    throw new Error('NIK is required to fetch user.');
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nik', sql.VarChar, nik)
      .query('SELECT * FROM users WHERE nik = @nik');

    if (result.recordset.length === 0) {
      return null; 
    }

    return result.recordset[0];
  } catch (error) {
    console.error('Error fetching user by NIK:', error.message);
    throw new Error('An error occurred while fetching the user.');
  }
};

/**
 * Create a new user in the database
 * @param {string} nik 
 * @param {string} name 
 * @param {string} email 
 * @param {string} hashedPassword 
 * @param {string} position 
 */
const createUser = async (nik, name, email, hashedPassword, position) => {
  if (!nik || !name || !email || !hashedPassword || !position) {
    throw new Error('All fields are required to create a user.');
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nik', sql.VarChar, nik)
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('position', sql.VarChar, position)
      .query(
        'INSERT INTO users (nik, name, email, password, position) VALUES (@nik, @name, @email, @password, @position)'
      );

    console.log(`User with NIK ${nik} created successfully.`);
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw new Error('An error occurred while creating the user.');
  }
};

module.exports = {
  getUserByNik,
  createUser,
};
