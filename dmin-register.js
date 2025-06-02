// public/js/admin-register.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-register-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Werte aus dem Formular
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
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
  
        const { message } = await response.json();
  
        if (response.ok) {
          alert('Registrierung erfolgreich! Sie können sich nun einloggen.');
          window.location.href = '/admin-login.html';
        } else {
          alert(message ?? 'Registrierung fehlgeschlagen');
        }
      } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        alert('Ein Fehler ist aufgetreten, bitte versuchen Sie es später noch einmal.');
      }
    });
  });