const express = require('express');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken package
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = "your-secret-key"; // Replace with a secure secret key

// In-memory storage for users, posts, and comments
let users = [{ username: "admin", password: "password" }]; // Example user
let posts = [];
let comments = {};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Login route to authenticate user and return a JWT token
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route example
app.get('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

// Get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Get a single post with comments
app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.json({ post, comments: comments[post.id] || [] });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Admin route to create a post (requires authentication)
app.post('/admin/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const id = posts.length + 1;
    posts.push({ id, title, content, timestamp: new Date() });
    comments[id] = [];
    res.status(201).json({ message: 'Post created', id });
});

// Add a comment to a post
app.post('/posts/:id/comments', (req, res) => {
    const { name, content } = req.body;
    const postId = parseInt(req.params.id);
    if (posts.some(post => post.id === postId)) {
        comments[postId].push({ name, content, timestamp: new Date() });
        res.status(201).json({ message: 'Comment added' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
