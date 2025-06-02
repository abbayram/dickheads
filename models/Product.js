const mongoose = require('mongoose');

// Produkt-Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array von Bild-URLs
  slug: { type: String, required: true, unique: true }, // Für die URL der Produktseite
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

// Pre-save Hook für Slug-Generierung, falls keiner angegeben wurde
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
