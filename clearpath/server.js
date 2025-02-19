const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Add cache control headers
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Add console log to debug static file serving
app.use(express.static('public'));
app.use('/logo', express.static(path.join(__dirname, 'public/logo')));

// Add a new API endpoint
app.get('/api/time', (req, res) => {
    const currentTime = new Date().toLocaleTimeString();
    res.json({ time: currentTime });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'paginainicial.html'));
});

app.get('/oportunidades', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'oportunidades.html'));
});

app.get('/interesses', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'interesses.html'));
});

app.get('/contactos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contactos.html'));
});

app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sobre.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`ClearPath running at http://localhost:${port}`);
});