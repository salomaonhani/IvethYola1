const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginButton = document.getElementById('loginButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    loginError.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'A AUTENTICAR...';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Não foi possível iniciar sessão.');
        }

        sessionStorage.setItem('ivethYolaAdminToken', data.token);
        sessionStorage.setItem('ivethYolaAdmin', JSON.stringify(data.admin));

        window.location.href = '/admin/dashboard.html';

    } catch (error) {
        loginError.textContent = error.message || 'Erro de ligação ao servidor.';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'ENTRAR NO PAINEL';
    }
});