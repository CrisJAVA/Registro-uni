document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value.trim();

            if (user === 'admin' && pass === '123456') {
                localStorage.setItem('adminAuth', 'true');
                errorDiv.classList.add('hidden');
                location.href = 'admin.html';
            } else {
                errorDiv.classList.remove('hidden');
                document.getElementById('loginPass').value = '';
                document.getElementById('loginPass').focus();
            }
        });
    }

    if (localStorage.getItem('adminAuth') === 'true') {
        location.href = 'admin.html';
    }
});
