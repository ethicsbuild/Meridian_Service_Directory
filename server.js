const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to the JSON file that stores service listings
const SERVICES_FILE = path.join(__dirname, 'services.json');

// Helper functions
function readServices() {
  try {
    const data = fs.readFileSync(SERVICES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeServices(services) {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/services.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});

// API Routes
app.get('/api/services', (req, res) => {
  const services = readServices();
  res.json(services);
});

app.post('/api/services', (req, res) => {
  try {
    const newService = req.body;
    const services = readServices();
    newService.id = Date.now();
    services.push(newService);
    writeServices(services);
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});