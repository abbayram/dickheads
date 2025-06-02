// public/js/admin-login.js

// Sobald das DOM geladen ist, Listener für das Formular setzen
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        const { token, admin, message } = await response.json();
  
        if (response.ok && token) {
          // Token und Admin-Daten im localStorage speichern
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminData', JSON.stringify(admin));
  
          // Zur Hauptseite weiterleiten
          window.location.href = '/index.html';
        } else {
          alert(message ?? 'Login fehlgeschlagen');
        }
      } catch (err) {
        console.error('Fehler beim Login:', err);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
    });
  });