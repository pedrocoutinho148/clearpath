const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for opportunities page
app.get('/oportunidades', (req, res) => {
    res.sendFile(path.join(__dirname, 'oportunidades.html'));
});

// Route for interests page
app.get('/interesses', (req, res) => {
    res.sendFile(path.join(__dirname, 'interesses.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});