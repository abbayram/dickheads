// Produktseiten-Generator
const fs = require('fs');
const path = require('path');

async function createProductPage(product) {
    try {
        const template = fs.readFileSync(path.join(__dirname, 'templates', 'product-template.html'), 'utf8');
        
        // Template mit Produktdaten ersetzen
        let productPage = template
            .replace(/{{product_name}}/g, product.name)
            .replace(/{{product_description}}/g, product.description)
            .replace(/{{product_price}}/g, product.price.toFixed(2) + ' €');
        
        // Bildergalerie generieren
        let imageGallery = '';
        product.images.forEach(image => {
            imageGallery += `<div class="product-image">
                <img src="${image}" alt="${product.name}">
            </div>`;
        });
        
        productPage = productPage.replace('{{product_images}}', imageGallery);
        
        // Seitendatei schreiben
        const outputPath = path.join(__dirname, 'public', 'products', `${product.slug}.html`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, productPage);
        
        console.log(`Produktseite für ${product.name} wurde erstellt!`);
        return true;
    } catch (error) {
        console.error('Fehler beim Erstellen der Produktseite:', error);
        return false;
    }
}

module.exports = { createProductPage };
