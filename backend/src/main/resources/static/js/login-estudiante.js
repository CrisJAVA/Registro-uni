document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    if (localStorage.getItem('estudianteToken')) {
        window.location.href = 'estudiante.html';
        return;
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const dni = document.getElementById('loginDni').value.trim();
            const pass = document.getElementById('loginPass').value.trim();

            if (!dni || !pass) {
                errorDiv.textContent = 'Ingrese DNI y contraseña.';
                errorDiv.classList.remove('hidden');
                return;
            }

            if (!/^\d{8}$/.test(dni)) {
                errorDiv.textContent = 'El DNI debe tener exactamente 8 dígitos.';
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const data = await apiPost('/api/auth/login-estudiante', {
                    username: dni,
                    password: pass
                });
                localStorage.setItem('estudianteToken', data.token);
                localStorage.setItem('estudianteData', JSON.stringify({
                    nombre: data.nombre,
                    email: data.email
                }));
                errorDiv.classList.add('hidden');
                window.location.href = 'estudiante.html';
            } catch (err) {
                errorDiv.textContent = err.message || 'Credenciales incorrectas. Intente nuevamente.';
                errorDiv.classList.remove('hidden');
                document.getElementById('loginPass').value = '';
                document.getElementById('loginPass').focus();
            }
        });
    }
});
