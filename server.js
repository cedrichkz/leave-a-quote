const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const dbPath = path.join(__dirname, 'quotes.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS quote (id INTEGER PRIMARY KEY, text TEXT, updated_at TEXT)');
    // Insert default quote if table is empty
    db.get('SELECT COUNT(*) as count FROM quote', (err, row) => {
        if (row.count === 0) {
            db.run('INSERT INTO quote (text, updated_at) VALUES (?, ?)', ['Job your love', new Date().toISOString()]);
        }
    });
});

// Get current quote
app.get('/api/quote', (req, res) => {
    db.get('SELECT text, updated_at FROM quote ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// Update quote
app.post('/api/quote', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Quote text required' });
    const updatedAt = new Date().toISOString();
    db.run('INSERT INTO quote (text, updated_at) VALUES (?, ?)', [text, updatedAt], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ text, updated_at: updatedAt });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
