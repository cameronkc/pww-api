const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path'); // Add this line to require the path module
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const fetchSenateTrades = async () => {
  const apiUrl = `https://financialmodelingprep.com/api/v4/senate-trading-rss-feed?page=0&apikey=${process.env.API_KEY}`; // Corrected env.API_KEY to process.env.API_KEY
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    return [];
  }
};

app.get('/api/senate-trades', async (req, res) => {
  const trades = await fetchSenateTrades();
  res.json(trades);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
