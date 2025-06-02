import Product from '../models/Product.js';
import slugify from 'slugify';
import { createProductPage } from '../utils/productPageGenerator.js';

/**
 * @desc Alle Produkte abrufen
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

/**
 * @desc Einzelnes Produkt per Slug abrufen
 * @route GET /api/products/:slug
 * @access Public
 */
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    
    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

/**
 * @desc Neues Produkt erstellen
 * @route POST /api/products
 * @access Private (Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const slug = slugify(name, { lower: true });

    // Prüfen, ob der Slug schon existiert
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Ein Produkt mit diesem Namen existiert bereits' });
    }

    // Bilder-Pfade aus Multer (upload.array('images')) aus req.files ziehen
    const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Neues Produkt anlegen
    const newProduct = new Product({
      name,
      description,
      price,
      images: imageUrls,
      slug,
      createdBy: req.adminData ? req.adminData.id : null // Vorausgesetzt, Auth-Middleware hat req.adminData gesetzt
    });

    await newProduct.save();

    // Generiere statische Produktseite (optional)
    try {
      await createProductPage(newProduct);
    } catch (pageError) {
      console.error('Fehler beim Erstellen der Produktseite:', pageError);
      // Produkt wurde gespeichert, daher kein return
    }

    return res.status(201).json({ 
      message: 'Produkt erfolgreich erstellt', 
      product: newProduct 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

/**
 * @desc Produkt aktualisieren
 * @route PUT /api/products/:id
 * @access Private (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // z. B. { name, description, price, images }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    // Beispiel: Wenn der Name geändert wird, aktualisiere den Slug
    if (updates.name && updates.name !== product.name) {
      updates.slug = slugify(updates.name, { lower: true });
    }

    // Bilder-Pfade ergänzen, falls neue Uploads im Frontend waren
    if (req.files?.length) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updates.images = [...(product.images || []), ...newImages];
    }

    const updated = await Product.findByIdAndUpdate(
      id, 
      updates,
      { new: true }
    );

    return res.status(200).json({ 
      message: 'Produkt erfolgreich aktualisiert',
      product: updated 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

/**
 * @desc Produkt löschen
 * @route DELETE /api/products/:id
 * @access Private (Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    // Mongoose .remove() ist veraltet, verwenden Sie .deleteOne()
    await Product.deleteOne({ _id: id });
    
    return res.status(200).json({ message: 'Produkt erfolgreich gelöscht' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};
