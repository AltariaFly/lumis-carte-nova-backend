const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'Lumis Carte Nova backend is alive!' });
});

app.get('/search/pricecharting', async (req, res) => {
  const query = req.query.card;
  if (!query) return res.status(400).json({ error: 'No card name provided' });

  try {
    const url = 'https://www.pricecharting.com/search-products?q=' + encodeURIComponent(query) + '&type=prices';
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const products = data.products || [];

    const results = products.slice(0, 10).map(function(p) {
      return {
        name: p.productName + ' (' + p.consoleName + ')',
        price: p.price1,
        link: 'https://www.pricecharting.com/game/' + p.consoleUid + '/' + p.id
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PriceCharting', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
