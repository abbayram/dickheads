// controllers/adminController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
  try {
    // Wir erwarten im Body: { username: "...", password: "..." }
    const { username, password } = req.body;

    // 1) Suche Admin in der DB
    //    Wir erlauben sowohl Login via E-Mail als auch via Username
    const admin = await Admin.findOne({
      $or: [
        { email: username },      // falls der Nutzer seine E-Mail eingibt
        { username: username }    // oder er gibt seinen Usernamen ein
      ]
    });
    if (!admin) {
      // Kein Admin mit dieser E-Mail/Username gefunden
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // 2) Vergleiche eingegebenes Passwort mit dem Hash aus DB
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // 3) Alles gut → Erstelle einen JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4) Gib das Token und ein paar Basis‐Infos zurück
    return res.status(200).json({
      message: 'Login erfolgreich',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};