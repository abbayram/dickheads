import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// ESM-Kompatibilität für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
// Statische Dateien aus dem public-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// API-Routen
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Hauptroute - sendet index.html zurück
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catchall-Route für SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
