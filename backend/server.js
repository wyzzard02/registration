const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const env=require('dotenv')
env.config()

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: process.env.DB_HOST, // e.g., 'localhost' or '127.0.0.1' or your remote host
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 10000 // 10 seconds timeout
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
app.get('/test',(req,res)=>{
  return res.send('hello world')
})
app.post('/api/registration', (req, res) => {
  const { name, email, phone, interests } = req.body;

  if (!name || !email || !phone || interests.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  console.log("INSERTING")
  const sql = 'INSERT INTO registrations (name, email, phone, interests) VALUES (?, ?, ?, ?)';
  const values = [name, email, phone, JSON.stringify(interests)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Failed to insert registration:', err);
      return res.status(500).json({ error: 'Failed to submit registration' });
    }
    res.status(200).json({ message: 'Registration received successfully' });
  });
  console.log("INSERTED")
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
