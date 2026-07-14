document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('estudianteToken');
    if (!token) {
        window.location.href = 'login-estudiante.html';
        return;
    }
    cargarPerfil();
});

async function cargarPerfil() {
    const loading = document.getElementById('loadingState');
    const content = document.getElementById('profileContent');

    try {
        const data = await apiGet('/api/auth/estudiante/perfil');

        document.getElementById('estudianteNombre').textContent = data.nombres + ' ' + data.apellidos;
        document.getElementById('estudianteNombre').classList.remove('hidden');

        document.getElementById('perfilTipoDoc').textContent = data.tipoDocumento || '-';
        document.getElementById('perfilNumDoc').textContent = data.numeroDocumento || '-';
        document.getElementById('perfilNombres').textContent = data.nombres || '-';
        document.getElementById('perfilApellidos').textContent = data.apellidos || '-';
        document.getElementById('perfilFechaNac').textContent = data.fechaNacimiento || '-';
        document.getElementById('perfilSexo').textContent = data.sexo || '-';
        document.getElementById('perfilEmail').textContent = data.email || '-';
        document.getElementById('perfilTelefono').textContent = data.telefono || '-';
        document.getElementById('perfilDepto').textContent = data.departamento || '-';
        document.getElementById('perfilProv').textContent = data.provincia || '-';
        document.getElementById('perfilDist').textContent = data.distrito || '-';
        document.getElementById('perfilDireccion').textContent = data.direccion || '-';
        document.getElementById('perfilArea').textContent = data.areaNombre || '-';
        document.getElementById('perfilCarrera').textContent = data.carreraNombre || '-';
        document.getElementById('perfilColegio').textContent = data.tipoColegio || '-';
        document.getElementById('perfilFechaReg').textContent = data.fechaRegistro || '-';

        if (data.debeCambiarPassword) {
            showChangePasswordModal();
        }

        loading.classList.add('hidden');
        content.classList.remove('hidden');
    } catch (err) {
        console.error('Error al cargar perfil:', err);
        if (err.message.includes('Sesión expirada') || err.message.includes('401')) {
            localStorage.removeItem('estudianteToken');
            localStorage.removeItem('estudianteData');
            window.location.href = 'login-estudiante.html';
        } else {
            loading.innerHTML = `
                <div class="flex flex-col items-center gap-sm text-center">
                    <span class="material-symbols-outlined text-5xl text-error">error</span>
                    <p class="text-on-surface font-body-md">Error al cargar el perfil</p>
                    <p class="text-on-surface-variant text-sm">${err.message}</p>
                    <button onclick="cargarPerfil()" class="mt-sm px-md py-xs rounded-lg bg-secondary text-on-secondary font-label-md text-sm hover:bg-on-secondary-container transition-colors">
                        Reintentar
                    </button>
                </div>`;
        }
    }
}

function triggerPhotoUpload() {
    document.getElementById('photoInput').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Seleccione un archivo de imagen válido.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photoPreview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        document.getElementById('photoPlaceholder').classList.add('hidden');
        localStorage.setItem('estudianteFoto', e.target.result);
    };
    reader.readAsDataURL(file);
}

function triggerHuellaUpload() {
    document.getElementById('huellaInput').click();
}

function handleHuellaUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Seleccione un archivo de imagen válido.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.getElementById('huellaContainer');
        container.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain p-2" alt="Huella digital"/>`;
        localStorage.setItem('estudianteHuella', e.target.result);
    };
    reader.readAsDataURL(file);
}

function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.id = 'changePasswordModal';
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-surface rounded-xl p-lg max-w-md w-full mx-sm shadow-xl">
            <h3 class="font-title-lg text-lg font-bold text-primary mb-md">Cambiar Contraseña</h3>
            <p class="text-on-surface-variant font-body-md text-sm mb-md">Por seguridad, debe cambiar su contraseña inicial.</p>
            <div class="flex flex-col gap-sm">
                <input id="newPassword" type="password" placeholder="Nueva contraseña" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20"/>
                <input id="confirmPassword" type="password" placeholder="Confirmar contraseña" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20"/>
                <p id="passwordError" class="text-error text-sm hidden"></p>
                <button onclick="changePassword()" class="w-full bg-secondary text-on-secondary rounded-lg py-sm font-label-md hover:bg-on-secondary-container transition-colors">
                    Guardar Contraseña
                </button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function changePassword() {
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const errorEl = document.getElementById('passwordError');

    if (newPass.length < 6) {
        errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        errorEl.classList.remove('hidden');
        return;
    }

    if (newPass !== confirmPass) {
        errorEl.textContent = 'Las contraseñas no coinciden.';
        errorEl.classList.remove('hidden');
        return;
    }

    document.getElementById('changePasswordModal').remove();
    alert('Contraseña cambiada exitosamente.');
}

function cerrarSesion() {
    localStorage.removeItem('estudianteToken');
    localStorage.removeItem('estudianteData');
    localStorage.removeItem('estudianteFoto');
    localStorage.removeItem('estudianteHuella');
    window.location.href = 'login-estudiante.html';
}
