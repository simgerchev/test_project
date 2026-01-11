const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const COUNT_FILE = path.join(__dirname, 'count.txt');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Initialize count.txt if it doesn't exist
if (!fs.existsSync(COUNT_FILE)) {
  fs.writeFileSync(COUNT_FILE, '0', 'utf8');
}

// Get current click count
app.get('/api/count', (req, res) => {
  try {
    const count = fs.readFileSync(COUNT_FILE, 'utf8').trim();
    res.json({ count: parseInt(count) || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read count' });
  }
});

// Increment click count
app.post('/api/click', (req, res) => {
  try {
    const currentCount = parseInt(fs.readFileSync(COUNT_FILE, 'utf8').trim()) || 0;
    const newCount = currentCount + 1;
    fs.writeFileSync(COUNT_FILE, newCount.toString(), 'utf8');
    res.json({ count: newCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update count' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
