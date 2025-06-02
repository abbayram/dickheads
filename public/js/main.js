// Funktion zum Laden der Produkte
async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      const productList = document.getElementById('product-list');
      
      if (data.products && data.products.length > 0) {
        // Lösche "Produkte werden geladen..." Nachricht
        productList.innerHTML = '';
        
        // Füge die Produktkarten hinzu
        data.products.forEach(product => {
          const imageSrc = product.images && product.images.length > 0 
            ? product.images[0] 
            : '/images/placeholder.jpg';
            
          productList.innerHTML += `
            <div class="product-card">
              <img src="${imageSrc}" alt="${product.name}">
              <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)} EUR</p>
                <a href="/products/${product.slug}" class="btn">Details</a>
              </div>
            </div>
          `;
        });
      } else {
        productList.innerHTML = '<p>Keine Produkte gefunden.</p>';
      }
    } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error);
      document.getElementById('product-list').innerHTML = '<p>Fehler beim Laden der Produkte.</p>';
    }
  }
  
  // Lade Produkte, wenn die Seite geladen ist
  document.addEventListener('DOMContentLoaded', loadProducts);
  