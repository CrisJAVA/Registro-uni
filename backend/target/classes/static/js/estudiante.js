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
        cargarDocumentos();
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

async function descargarPlantilla() {
    try {
        await apiDownload('/api/documentos/plantilla', 'plantilla_inscripcion.docx');
        mostrarToast('Plantilla descargada exitosamente', 'success');
    } catch (err) {
        mostrarToast('Error al descargar plantilla: ' + err.message, 'error');
    }
}

async function subirDocumentoPrincipal(event) {
    const file = event.target.files[0];
    if (!file) return;
    await subirArchivo(file, 'PLANTILLA', 'infoDocumentoPrincipal');
    event.target.value = '';
    cargarDocumentos();
}

async function subirArchivoAdicional(event) {
    const file = event.target.files[0];
    if (!file) return;
    await subirArchivo(file, 'ADICIONAL', null);
    event.target.value = '';
    cargarDocumentos();
}

async function subirArchivo(file, tipo, containerId) {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('tipo', tipo);

    try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/documentos/subir`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        if (handleAuthError(res.status)) {
            throw new Error('Sesión expirada');
        }

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Error al subir archivo' }));
            throw new Error(err.error || err.mensaje || 'Error al subir archivo');
        }

        const data = await res.json();
        mostrarToast('Archivo subido exitosamente: ' + data.nombreOriginal, 'success');
    } catch (err) {
        mostrarToast('Error: ' + err.message, 'error');
    }
}

async function cargarDocumentos() {
    try {
        const docs = await apiGet('/api/documentos/mis-documentos');
        renderizarDocumentos(docs);
    } catch (err) {
        if (!err.message.includes('Sesión')) {
            console.error('Error al cargar documentos:', err);
        }
    }
}

function renderizarDocumentos(docs) {
    const contenedorPrincipal = document.getElementById('infoDocumentoPrincipal');
    const contenedorAdicionales = document.getElementById('infoArchivosAdicionales');
    const contenedorTodos = document.getElementById('todosDocumentosContainer');
    const lista = document.getElementById('listaDocumentos');

    const principal = docs.filter(d => d.tipoDocumento === 'PLANTILLA');
    const adicionales = docs.filter(d => d.tipoDocumento === 'ADICIONAL');

    if (principal.length > 0) {
        contenedorPrincipal.classList.remove('hidden');
        contenedorPrincipal.innerHTML = principal.map(d => renderDocumentoItem(d)).join('');
    } else {
        contenedorPrincipal.classList.add('hidden');
        contenedorPrincipal.innerHTML = '';
    }

    if (adicionales.length > 0) {
        contenedorAdicionales.innerHTML = adicionales.map(d => renderDocumentoItem(d)).join('');
    } else {
        contenedorAdicionales.innerHTML = '<p class="text-on-surface-variant text-sm">No has subido archivos adicionales.</p>';
    }

    if (docs.length > 0) {
        contenedorTodos.classList.remove('hidden');
        lista.innerHTML = docs.map(d => renderDocumentoItem(d)).join('');
    } else {
        contenedorTodos.classList.add('hidden');
    }
}

function renderDocumentoItem(doc) {
    const estadoColors = {
        'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'APROBADO': 'bg-green-100 text-green-800 border-green-300',
        'EN_OBSERVACION': 'bg-red-100 text-red-800 border-red-300'
    };
    const estadoLabels = {
        'PENDIENTE': 'Pendiente',
        'APROBADO': 'Aprobado',
        'EN_OBSERVACION': 'En observación'
    };
    const estadoColor = estadoColors[doc.estado] || 'bg-gray-100 text-gray-800';
    const tipoLabel = doc.tipoDocumento === 'PLANTILLA' ? 'Principal' : 'Adicional';
    const tamanoKB = (doc.tamano / 1024).toFixed(1);
    const fechaSubida = new Date(doc.fechaSubida).toLocaleString('es-PE');

    let observacionHtml = '';
    if (doc.estado === 'EN_OBSERVACION' && doc.observacion) {
        observacionHtml = `
            <div class="mt-xs p-xs bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <span class="font-medium">Motivo:</span> ${escapeHtml(doc.observacion)}
            </div>`;
    }

    let accionesHtml = `
        <button onclick="descargarDocumento(${doc.id})" class="p-xs rounded-lg text-secondary hover:bg-secondary-container/20 transition-colors" title="Descargar">
            <span class="material-symbols-outlined text-lg">download</span>
        </button>`;

    if (doc.estado === 'EN_OBSERVACION') {
        accionesHtml += `
            <button onclick="reemplazarDocumento(${doc.id})" class="p-xs rounded-lg text-error hover:bg-error-container/20 transition-colors" title="Reemplazar archivo">
                <span class="material-symbols-outlined text-lg">refresh</span>
            </button>`;
    }

    return `
        <div class="flex items-start gap-sm p-sm bg-surface rounded-lg border border-outline-variant ${doc.estado === 'EN_OBSERVACION' ? 'border-l-4 border-l-red-500' : ''}">
            <span class="material-symbols-outlined text-on-surface-variant mt-1">${doc.tipoDocumento === 'PLANTILLA' ? 'description' : 'attach_file'}</span>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-xs flex-wrap">
                    <span class="font-medium text-sm text-on-surface truncate">${escapeHtml(doc.nombreOriginal)}</span>
                    <span class="text-xs text-on-surface-variant">(${tamanoKB} KB)</span>
                    <span class="text-xs bg-surface-container-high px-xs py-0.5 rounded text-on-surface-variant">${tipoLabel}</span>
                    <span class="text-xs px-xs py-0.5 rounded border ${estadoColor}">${estadoLabels[doc.estado]}</span>
                </div>
                <div class="text-xs text-on-surface-variant mt-0.5">Subido: ${fechaSubida}</div>
                ${observacionHtml}
            </div>
            <div class="flex items-center gap-xs flex-shrink-0">
                ${accionesHtml}
            </div>
        </div>`;
}

async function descargarDocumento(id) {
    try {
        const docs = await apiGet('/api/documentos/mis-documentos');
        const doc = docs.find(d => d.id === id);
        await apiDownload(`/api/documentos/${id}/descargar`, doc ? doc.nombreOriginal : 'documento');
        mostrarToast('Descarga iniciada', 'success');
    } catch (err) {
        mostrarToast('Error al descargar: ' + err.message, 'error');
    }
}

async function reemplazarDocumento(id) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.pdf';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const token = getToken();
            const res = await fetch(`${API_BASE}/api/documentos/${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (handleAuthError(res.status)) {
                throw new Error('Sesión expirada');
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Error al reemplazar' }));
                throw new Error(err.error || 'Error al reemplazar');
            }

            await subirArchivo(file, 'PLANTILLA', null);
            cargarDocumentos();
        } catch (err) {
            mostrarToast('Error: ' + err.message, 'error');
        }
    };
    input.click();
}

function mostrarToast(mensaje, tipo) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const bgColor = tipo === 'success' ? 'bg-green-600' : tipo === 'error' ? 'bg-red-600' : 'bg-blue-600';
    const icon = tipo === 'success' ? 'check_circle' : tipo === 'error' ? 'error' : 'info';

    toast.className = `${bgColor} text-white px-md py-sm rounded-lg shadow-lg flex items-center gap-sm animate-in slide-in-from-right duration-300`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-lg">${icon}</span>
        <span class="font-body-md text-sm">${escapeHtml(mensaje)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function cerrarSesion() {
    localStorage.removeItem('estudianteToken');
    localStorage.removeItem('estudianteData');
    localStorage.removeItem('estudianteFoto');
    localStorage.removeItem('estudianteHuella');
    window.location.href = 'login-estudiante.html';
}
