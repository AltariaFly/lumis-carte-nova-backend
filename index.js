const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'Lumis Carte Nova backend is alive!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
