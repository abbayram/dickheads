
document.addEventListener('DOMContentLoaded', () => {
    // Admin-Status überprüfen
    checkAdminStatus();
    
    // Produkte laden
    loadProducts();
    
    // Event Listener für das Logout-Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Event Listener für das Produktformular
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', createProduct);
    }
    
    // Bild-Vorschau
    const productImages = document.getElementById('product-images');
    if (productImages) {
        productImages.addEventListener('change', previewImages);
    }
});

// Funktion zum Überprüfen des Admin-Status
function checkAdminStatus() {
    const token = localStorage.getItem('adminToken');
    const adminLinks = document.getElementById('admin-links');
    const loginLinks = document.getElementById('login-links');
    const addProductSection = document.getElementById('add-product-section');
    
    if (token) {
        // Admin ist eingeloggt
        adminLinks.style.display = 'flex';
        loginLinks.style.display = 'none';
        if (addProductSection) {
            addProductSection.style.display = 'block';
        }
    } else {
        // Kein Admin eingeloggt
        adminLinks.style.display = 'none';
        loginLinks.style.display = 'flex';
        if (addProductSection) {
            addProductSection.style.display = 'none';
        }
    }
}

// Funktion zum Laden der Produkte
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        if (data.products.length === 0) {
            productGrid.innerHTML = '<p>Keine Produkte gefunden</p>';
            return;
        }
        
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const mainImage = product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${mainImage}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price.toFixed(2)} €</p>
                    <a href="/products/${product.slug}.html" class="btn">Details</a>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
    }
}

// Funktion zum Abmelden
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.reload();
}

// Funktion zum Erstellen eines neuen Produkts
async function createProduct(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Sie müssen eingeloggt sein, um Produkte zu erstellen.');
        return;
    }
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Produkt erfolgreich erstellt!');
            form.reset();
            document.getElementById('image-preview').innerHTML = '';
            loadProducts(); // Produkte neu laden
        } else {
            alert(data.message || 'Fehler beim Erstellen des Produkts');
        }
    } catch (error) {
        console.error('Fehler beim Erstellen des Produkts:', error);
        alert('Ein Fehler ist aufgetreten, bitte versuchen Sie es später noch einmal.');
    }
}

// Funktion zur Vorschau der hochgeladenen Bilder
function previewImages(e) {
    const files = e.target.files;
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) continue;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'preview-image';
            imagePreview.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    }
}
