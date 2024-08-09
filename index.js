const express = require('express');
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for posts and comments
let posts = [];
let comments = {};

// Routes
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

// Admin route to create a post
app.post('/admin/post', (req, res) => {
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

app.use(express.static('public'));

