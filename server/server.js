const express = require('express');
const mysql = require('mysql2');
const productRoutes = require('./routes/products');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'authentithief'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(express.json());
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use('/api/products', productRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
