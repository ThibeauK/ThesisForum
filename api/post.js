let posts = [];  // In-memory array to store posts

export default function handler(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  const jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.JWT_SECRET;

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    // Handle POST request to create a new post
    if (req.method === 'POST') {
      const { title, content } = req.body;
      const newPost = {
        id: posts.length + 1,
        title,
        content,
        author: user.username,
        timestamp: new Date()
      };

      posts.push(newPost);
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } else if (req.method === 'GET') {
      res.status(200).json(posts);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
