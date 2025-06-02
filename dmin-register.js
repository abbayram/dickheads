// a
document.getElementById('admin-register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Passwort-Überprüfung
    if (password !== confirmPassword) {
        return alert('Die Passwörter stimmen nicht überein!');
    }
    
    try {
        const response = await fetch('/api/admin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registrierung erfolgreich! Sie können sich nun einloggen.');
            window.location.href = 'admin-login.html';
        } else {
            alert(data.message || 'Registrierung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        alert('Ein Fehler ist aufgetreten, bitte versuchen Sie es später noch einmal.');
    }
});
