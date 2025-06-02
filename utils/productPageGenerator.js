// src/utils/productPageGenerator.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Produktseiten-Generator
 * Liest ein HTML-Template ein, ersetzt Platzhalter durch Produktdaten
 * und speichert die generierte Seite unter public/products/<slug>.html
 */
export async function createProductPage(product) {
  try {
    // Template-Datei einlesen
    const templatePath = path.join(__dirname, 'templates', 'product-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Platzhalter im Template durch Produktdaten ersetzen
    let productPage = template
      .replace(/{{product_name}}/g, product.name)
      .replace(/{{product_description}}/g, product.description)
      .replace(/{{product_price}}/g, product.price.toFixed(2) + ' €');

    // Bildergalerie zusammenbauen
    let imageGallery = '';
    for (const image of product.images) {
      imageGallery += `
        <div class="product-image">
          <img src="${image}" alt="${product.name}" />
        </div>
      `;
    }
    productPage = productPage.replace('{{product_images}}', imageGallery);

    // Ausgabe-Pfad: public/products/<slug>.html
    const outputPath = path.join(__dirname, '..', 'public', 'products', `${product.slug}.html`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, productPage, 'utf8');

    console.log(`✅ Produktseite für "${product.name}" wurde erstellt!`);
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Produktseite:', error);
    return false;
  }
}