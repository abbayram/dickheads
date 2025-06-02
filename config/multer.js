import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguration für Multer: Wo und wie Dateien gespeichert werden
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Speichere Uploads in /public/uploads/
    const uploadPath = path.join(process.cwd(), 'public', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generiere einen eindeutigen Dateinamen mit Zeitstempel
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// Dateifilter: Nur Bilder erlauben
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien (JPEG, PNG, GIF, WEBP) sind erlaubt!'), false);
  }
};

// Multer-Upload-Instanz erstellen
export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximale Dateigröße
  }
});

export default upload;
