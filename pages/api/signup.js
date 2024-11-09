import pool from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Hash the password for security
      const hashedPassword = await bcrypt.hash(password, 10);

      const connection = await pool.getConnection();

      // Insert user data into the database
      const [result] = await connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );

      connection.release();

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
