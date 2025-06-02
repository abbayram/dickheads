const Product = require('../models/Product');

// @desc    Alle Produkte abrufen
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Einzelnes Produkt abrufen
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produkt nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Neues Produkt erstellen
// @route   POST /api/products
// @access  Private (nur Admins)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, images, slug } = req.body;

    // Überprüfen, ob Slug bereits existiert
    const existingProduct = await Product.findOne({ slug });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Ein Produkt mit diesem Slug existiert bereits'
      });
    }

    // Neues Produkt erstellen
    const product = await Product.create({
      name,
      description,
      price,
      images: images || [],
      slug,
      createdBy: req.admin.id
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Produkt aktualisieren
// @route   PUT /api/products/:id
// @access  Private (nur Admins)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produkt nicht gefunden'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Produkt löschen
// @route   DELETE /api/products/:id
// @access  Private (nur Admins)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produkt nicht gefunden'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
