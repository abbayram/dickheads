// admin-login.js
document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Token im localStorage speichern
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminData', JSON.stringify(data.admin));
            
            // Zur Hauptseite weiterleiten
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login fehlgeschlagen');
        }
    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert('Ein Fehler ist aufgetreten, bitte versuchen Sie es später noch einmal.');
    }
});
