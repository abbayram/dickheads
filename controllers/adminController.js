const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Registrieren eines neuen Admins
// @route   POST /api/admin/register
// @access  Public
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Überprüfen, ob Admin bereits existiert
    let admin = await Admin.findOne({ $or: [{ email }, { username }] });
    
    if (admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin mit dieser E-Mail oder diesem Benutzernamen existiert bereits'
      });
    }

    // Neuen Admin erstellen
    admin = new Admin({
      username,
      email,
      password
    });

    // Admin speichern (Passwort wird in der pre-save Middleware gehasht)
    await admin.save();

    // JWT Token generieren
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin in der Datenbank finden
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldeinformationen'
      });
    }

    // Passwort überprüfen
    const isPasswordMatch = await admin.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldeinformationen'
      });
    }

    // JWT Token generieren
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Admin Profil abrufen
// @route   GET /api/admin/profile
// @access  Private
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
