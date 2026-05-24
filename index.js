const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'Lumis Carte Nova backend is alive!' });
});

// PriceCharting search
app.get('/search/pricecharting', async (req, res) => {
  const query = req.query.card;
  if (!query) return res.status(400).json({ error: 'No card name provided' });

  try {
    const url = `https://www.pricecharting.com/search-products?q=${encodeURIComponent(query)}&type=prices`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('table#games_table tbody tr').each((i, el) => {
      if (i >= 10) return false;
      const name = $(el).find('td.title a').text().trim();
      const price = $(el).find('td.price').first().text().trim();
      const link = 'https://www.pricecharting.com' + $(el).find('td.title a').attr('href');
      if (name) results.push({ name, price, link });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PriceCharting', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
