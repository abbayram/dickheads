const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Umgebungsvariablen laden
dotenv.config();

// Verbindung zur Datenbank herstellen
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Standardroute
app.get('/', (req, res) => {
  res.send('API läuft...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
