const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const COUNT_FILE = path.join(__dirname, 'count.txt');

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize count.txt if it doesn't exist
if (!fs.existsSync(COUNT_FILE)) {
  fs.writeFileSync(COUNT_FILE, '0', 'utf8');
  console.log('Created count.txt file');
}

// Get current click count
app.get('/api/count', (req, res) => {
  try {
    const count = fs.readFileSync(COUNT_FILE, 'utf8').trim();
    console.log('Read count:', count);
    res.json({ count: parseInt(count) || 0 });
  } catch (error) {
    console.error('Error reading count:', error);
    res.status(500).json({ error: 'Failed to read count', details: error.message });
  }
});

// Increment click count
app.post('/api/click', (req, res) => {
  try {
    console.log('Received click request');
    const currentCount = parseInt(fs.readFileSync(COUNT_FILE, 'utf8').trim()) || 0;
    const newCount = currentCount + 1;
    fs.writeFileSync(COUNT_FILE, newCount.toString(), 'utf8');
    console.log('Updated count to:', newCount);
    res.json({ count: newCount });
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ error: 'Failed to update count', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
