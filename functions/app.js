const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const serverless = require("serverless-http");
const router = express.Router();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

router.get("/", (req, res) => {
    res.send("App is running..");
});

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);

const fetchSenateTrades = async () => {
  const apiUrl = `https://financialmodelingprep.com/api/v4/senate-trading-rss-feed?page=0&apikey=${process.env.API_KEY}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    return [];
  }
};

const fetchHouseTrades = async () => {
  const apiUrl = `https://financialmodelingprep.com/api/v4/senate-disclosure-rss-feed?page=0&apikey=${process.env.API_KEY}`;
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

app.get('/api/house-trades', async (req, res) => {
  const trades = await fetchHouseTrades();
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
