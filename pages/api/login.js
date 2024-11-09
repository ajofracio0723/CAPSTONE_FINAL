import pool from '../lib/db';  // Adjust the path as needed
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const connection = await pool.getConnection();

      // Check if the user exists
      const [users] = await connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      connection.release();

      if (users.length === 0) {
        // User not found
        return res.status(401).json({ error: 'User not registered' });
      }

      const user = users[0];

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        // Incorrect password
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Login successful
      res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
