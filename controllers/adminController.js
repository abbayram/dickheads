// controllers/adminController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// @desc    Admin registrieren
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Prüfen, ob Admin existiert
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Benutzer oder E-Mail bereits vergeben' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin erfolgreich registriert' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

// @desc    Admin einloggen
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin per Username oder E-Mail suchen
    const admin = await Admin.findOne({
      $or: [{ email: username }, { username }]
    });
    if (!admin) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Passwort prüfen
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Token generieren
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login erfolgreich',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};