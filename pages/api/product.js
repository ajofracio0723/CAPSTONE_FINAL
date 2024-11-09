const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(results);
    }
  });
});

router.post('/', (req, res) => {
  const { name, brand, is_authentic, registration_date, qrcode_data } = req.body;
  req.db.query(
    'INSERT INTO products (name, brand, is_authentic, registration_date, qrcode_data) VALUES (?, ?, ?, ?, ?)',
    [name, brand, is_authentic, registration_date, qrcode_data],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to add product' });
      } else {
        res.json({ id: result.insertId, ...req.body });
      }
    }
  );
});

module.exports = router;
