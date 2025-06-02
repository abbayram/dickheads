import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  // Token aus dem Authorization-Header lesen
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Überprüfen, ob Token existiert
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Kein Token, Zugriff verweigert'
    });
  }

  try {
    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin aus der Datenbank laden
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Ungültiger Token, Zugriff verweigert'
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: 'Ungültiger Token, Zugriff verweigert'
    });
  }
};