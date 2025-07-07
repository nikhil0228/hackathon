const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy endpoint: /api-proxy
app.use('/api-proxy', async (req, res) => {
  const url = req.query.url;
  const token = req.headers['authorization'];
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`)); 