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

// Umgebungsvariablen laden
dotenv.config();

// Mit MongoDB verbinden
connectDB();

const app = express();

// Body-Parser für JSON-Requests
app.use(express.json());

// CORS aktivieren (optional, falls API von anderem Ursprung aus genutzt wird)
app.use(cors());

// API-Routen müssen VOR der statischen Auslieferung stehen
app.use('/api/products', productRoutes);
app.use('/api/admin',    adminRoutes);

// Statische Dateien aus dem public-Ordner ausliefern (HTML, CSS, JS, Bilder, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Falls du explizit Login- oder Registerseiten über Routen ausliefern möchtest:
// (Diese beiden Endpunkte werden durch express.static bereits automatisch bedient,
// solange die Dateien in public/admin/ liegen. Du kannst sie aber hier optional absichern.)

// Beispiel: Route, um login.html aus public/admin/ auszuliefern
app.get('/admin/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

// Beispiel: Route, um register.html aus public/admin/ auszuliefern
app.get('/admin/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'register.html'));
});

// Hauptroute (liefert index.html für SPA aus)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catchall-Route für SPA - liefert index.html, wenn keine vorherige Route passt
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server starten
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
