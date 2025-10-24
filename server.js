const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'mysecretkey';

// Hardcoded user
const user = {
  id: 1,
  username: 'testuser',
  password: 'password123'
};

// Login route - issues JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'You have accessed a protected route!',
    user: req.user
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
