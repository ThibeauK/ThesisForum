const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Replace with your user authentication logic
    if (username === 'admin' && password === 'password') {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
