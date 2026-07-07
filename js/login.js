document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    if (localStorage.getItem('token')) {
        location.href = 'admin.html';
        return;
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value.trim();

            if (!user || !pass) {
                errorDiv.textContent = 'Ingrese usuario y contraseña.';
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const data = await apiPost('/api/auth/login', {
                    username: user,
                    password: pass
                });
                localStorage.setItem('token', data.token);
                localStorage.setItem('adminUser', JSON.stringify({
                    nombre: data.nombre,
                    email: data.email
                }));
                errorDiv.classList.add('hidden');
                location.href = 'admin.html';
            } catch (err) {
                errorDiv.textContent = err.message || 'Credenciales incorrectas. Intente nuevamente.';
                errorDiv.classList.remove('hidden');
                document.getElementById('loginPass').value = '';
                document.getElementById('loginPass').focus();
            }
        });
    }
});
