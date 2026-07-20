let postulantesData = [];
let editandoId = null;
let areasCache = [];
let carrerasCache = [];
let documentosData = [];
let documentoRevisandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    cargarDatos();
});

async function cargarDatos() {
    try {
        const [postulantes, areas] = await Promise.all([
            apiGet('/api/postulantes'),
            apiGet('/api/areas')
        ]);
        postulantesData = postulantes;
        areasCache = areas;

        const carrerasPromises = areas.map(a => apiGet(`/api/carreras?areaId=${a.id}`));
        const carrerasPorArea = await Promise.all(carrerasPromises);
        carrerasCache = carrerasPorArea.flat();

        actualizarEstadisticas();
        poblarFiltros();
        renderizarTabla(postulantesData);
    } catch (err) {
        console.error('Error al cargar datos:', err);
        const tbody = document.getElementById('tablaPostulantes');
        tbody.innerHTML = `<tr><td colspan="6" class="px-md py-xl text-center text-error">
            Error al cargar datos: ${err.message}
        </td></tr>`;
    }
}

function actualizarEstadisticas() {
    document.getElementById('totalPostulantes').textContent = postulantesData.length;
    const carreras = new Set(postulantesData.filter(p => p.carreraNombre).map(p => p.carreraNombre));
    const areas = new Set(postulantesData.filter(p => p.areaNombre).map(p => p.areaNombre));
    document.getElementById('totalCarreras').textContent = carreras.size;
    document.getElementById('totalAreas').textContent = areas.size;
}

function poblarFiltros() {
    const selectArea = document.getElementById('filterArea');
    selectArea.innerHTML = '<option value="">Todas</option>';
    areasCache.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area.id;
        opt.textContent = area.nombre;
        selectArea.appendChild(opt);
    });

    const selectCarrera = document.getElementById('filterCarrera');
    selectCarrera.innerHTML = '<option value="">Todas</option>';
    carrerasCache.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nombre;
        selectCarrera.appendChild(opt);
    });
}

async function filtrarPostulantes() {
    const busqueda = document.getElementById('searchInput').value.trim();
    const areaId = document.getElementById('filterArea').value;
    const carreraId = document.getElementById('filterCarrera').value;

    const params = new URLSearchParams();
    if (busqueda) params.append('search', busqueda);
    if (areaId) params.append('areaId', areaId);
    if (carreraId) params.append('carreraId', carreraId);

    try {
        const query = params.toString();
        const data = await apiGet(`/api/postulantes${query ? '?' + query : ''}`);
        postulantesData = data;
        renderizarTabla(data);
    } catch (err) {
        console.error('Error al filtrar:', err);
    }
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tablaPostulantes');
    const emptyState = document.getElementById('emptyState');

    if (data.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = data.map(p => `
        <tr class="hover:bg-surface-container-low transition-colors">
            <td class="px-md py-sm text-on-surface font-medium">${escapeHtml(p.numeroDocumento || '-')}</td>
            <td class="px-md py-sm text-on-surface">${escapeHtml(p.nombres || '-')}</td>
            <td class="px-md py-sm text-on-surface">${escapeHtml(p.apellidos || '-')}</td>
            <td class="px-md py-sm text-on-surface-variant">${escapeHtml(p.areaNombre || '-')}</td>
            <td class="px-md py-sm text-on-surface-variant">${escapeHtml(p.carreraNombre || '-')}</td>
            <td class="px-md py-sm">
                <div class="flex items-center justify-center gap-xs">
                    <button onclick="verPostulante(${p.id})" title="Ver"
                        class="p-xs rounded-lg text-primary hover:bg-primary-container/20 transition-colors">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button onclick="editarPostulante(${p.id})" title="Editar"
                        class="p-xs rounded-lg text-secondary hover:bg-secondary-container/20 transition-colors">
                        <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onclick="confirmarEliminar(${p.id})" title="Eliminar"
                        class="p-xs rounded-lg text-error hover:bg-error-container/20 transition-colors">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function verPostulante(id) {
    try {
        const p = await apiGet(`/api/postulantes/${id}`);
        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Tipo de Documento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.tipoDocumento || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Número de Documento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.numeroDocumento || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Nombres</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.nombres || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Apellidos</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.apellidos || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Fecha de Nacimiento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.fechaNacimiento || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Sexo</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.sexo || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Correo Electrónico</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.email || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Teléfono</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.telefono || '-')}</span>
                </div>
                <div class="md:col-span-2 flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Dirección</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.direccion || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Departamento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.departamento || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Provincia</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.provincia || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Distrito</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.distrito || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Tipo de Colegio</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.tipoColegio || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Área</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.areaNombre || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Carrera</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.carreraNombre || '-')}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Fecha de Registro</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${escapeHtml(p.fechaRegistro || '-')}</span>
                </div>
            </div>
        `;
        document.getElementById('viewModal').classList.remove('hidden');
    } catch (err) {
        alert('Error al obtener datos del postulante: ' + err.message);
    }
}

async function editarPostulante(id) {
    try {
        const p = await apiGet(`/api/postulantes/${id}`);
        editandoId = id;

        const form = document.getElementById('editForm');
        form.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Tipo de Documento</label>
                    <select name="tipoDocumento" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                        <option ${p.tipoDocumento === 'DNI' ? 'selected' : ''}>DNI</option>
                        <option ${p.tipoDocumento === 'Carné de Extranjería' ? 'selected' : ''}>Carné de Extranjería</option>
                        <option ${p.tipoDocumento === 'Pasaporte' ? 'selected' : ''}>Pasaporte</option>
                    </select>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Número de Documento</label>
                    <input name="numeroDocumento" value="${escapeHtml(p.numeroDocumento || '')}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Nombres</label>
                    <input name="nombres" value="${escapeHtml(p.nombres || '')}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Apellidos</label>
                    <input name="apellidos" value="${escapeHtml(p.apellidos || '')}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Correo Electrónico</label>
                    <input name="email" value="${escapeHtml(p.email || '')}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="email"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Teléfono</label>
                    <input name="telefono" value="${escapeHtml(p.telefono || '')}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="tel"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Área</label>
                    <select name="areaId" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                        <option value="">Seleccione</option>
                        ${areasCache.map(a => `<option value="${a.id}" ${p.areaId === a.id ? 'selected' : ''}>${escapeHtml(a.nombre)}</option>`).join('')}
                    </select>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Carrera</label>
                    <select name="carreraId" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                        <option value="">Seleccione</option>
                        ${carrerasCache.map(c => `<option value="${c.id}" ${p.carreraId === c.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
        document.getElementById('editModal').classList.remove('hidden');
    } catch (err) {
        alert('Error al cargar datos del postulante: ' + err.message);
    }
}

function confirmarEliminar(id) {
    const p = postulantesData.find(item => item.id === id);
    if (!p) return;
    editandoId = id;
    document.getElementById('deleteNombre').textContent = `${p.nombres} ${p.apellidos}`;
    document.getElementById('confirmDeleteBtn').onclick = function() {
        eliminarPostulante(id);
    };
    document.getElementById('deleteModal').classList.remove('hidden');
}

async function eliminarPostulante(id) {
    try {
        await apiDelete(`/api/postulantes/${id}`);
        cerrarModal('deleteModal');
        await cargarDatos();
    } catch (err) {
        alert('Error al eliminar: ' + err.message);
    }
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function mostrarTab(tab) {
    document.getElementById('tabPostulantes').classList.toggle('hidden', tab !== 'postulantes');
    document.getElementById('tabDocumentos').classList.toggle('hidden', tab !== 'documentos');

    const btnPost = document.getElementById('tabBtnPostulantes');
    const btnDoc = document.getElementById('tabBtnDocumentos');

    if (tab === 'postulantes') {
        btnPost.className = 'bg-primary text-on-primary px-md py-xs rounded-lg font-label-md text-label-md hover:bg-secondary transition-all active:scale-95 flex items-center gap-xs';
        btnDoc.className = 'bg-surface-container-high text-on-surface-variant px-md py-xs rounded-lg font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 flex items-center gap-xs';
    } else {
        btnDoc.className = 'bg-primary text-on-primary px-md py-xs rounded-lg font-label-md text-label-md hover:bg-secondary transition-all active:scale-95 flex items-center gap-xs';
        btnPost.className = 'bg-surface-container-high text-on-surface-variant px-md py-xs rounded-lg font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 flex items-center gap-xs';
        if (documentosData.length === 0) cargarDocumentosAdmin();
    }
}

async function cargarDocumentosAdmin() {
    try {
        documentosData = await apiGet('/api/admin/documentos');
        renderizarTablaDocumentos(documentosData);
    } catch (err) {
        console.error('Error al cargar documentos:', err);
        const tbody = document.getElementById('tablaDocumentos');
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="px-md py-xl text-center text-error">Error al cargar documentos: ${err.message}</td></tr>`;
    }
}

function renderizarTablaDocumentos(data) {
    const tbody = document.getElementById('tablaDocumentos');
    const emptyState = document.getElementById('emptyDocsState');

    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const estadoLabels = { 'PENDIENTE': 'Pendiente', 'APROBADO': 'Aprobado', 'EN_OBSERVACION': 'En observación' };
    const estadoColors = {
        'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'APROBADO': 'bg-green-100 text-green-800 border-green-300',
        'EN_OBSERVACION': 'bg-red-100 text-red-800 border-red-300'
    };
    const tipoLabels = { 'PLANTILLA': 'Principal', 'ADICIONAL': 'Adicional' };

    tbody.innerHTML = data.map(d => `
        <tr class="hover:bg-surface-container-low transition-colors ${d.estado === 'EN_OBSERVACION' ? 'bg-red-50/50' : ''}">
            <td class="px-md py-sm">
                <div class="font-medium text-on-surface text-sm">${escapeHtml(d.postulanteNombre + ' ' + d.postulanteApellido)}</div>
                <div class="text-xs text-on-surface-variant">DNI: ${escapeHtml(d.postulanteDocumento || '-')}</div>
            </td>
            <td class="px-md py-sm text-on-surface text-sm max-w-[200px] truncate">${escapeHtml(d.nombreOriginal)}</td>
            <td class="px-md py-sm"><span class="text-xs bg-surface-container-high px-xs py-0.5 rounded text-on-surface-variant">${tipoLabels[d.tipoDocumento] || d.tipoDocumento}</span></td>
            <td class="px-md py-sm text-on-surface-variant text-sm">${new Date(d.fechaSubida).toLocaleString('es-PE')}</td>
            <td class="px-md py-sm">
                <span class="text-xs px-xs py-0.5 rounded border ${estadoColors[d.estado] || 'bg-gray-100 text-gray-800'}">${estadoLabels[d.estado] || d.estado}</span>
                ${d.estado === 'EN_OBSERVACION' && d.observacion ? `<div class="text-xs text-red-600 mt-0.5 max-w-[150px] truncate" title="${escapeHtml(d.observacion)}">${escapeHtml(d.observacion)}</div>` : ''}
            </td>
            <td class="px-md py-sm">
                <div class="flex items-center justify-center gap-xs">
                    <button onclick="descargarDocumentoAdmin(${d.id})" title="Descargar"
                        class="p-xs rounded-lg text-secondary hover:bg-secondary-container/20 transition-colors">
                        <span class="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button onclick="abrirRevisarModal(${d.id})" title="Revisar"
                        class="p-xs rounded-lg text-primary hover:bg-primary-container/20 transition-colors">
                        <span class="material-symbols-outlined text-lg">rate_review</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filtrarDocumentosAdmin() {
    const busqueda = document.getElementById('docSearchInput').value.trim().toLowerCase();
    const estado = document.getElementById('docFilterEstado').value;

    let filtrados = documentosData;

    if (busqueda) {
        filtrados = filtrados.filter(d =>
            (d.postulanteNombre + ' ' + d.postulanteApellido).toLowerCase().includes(busqueda) ||
            d.nombreOriginal.toLowerCase().includes(busqueda)
        );
    }

    if (estado) {
        filtrados = filtrados.filter(d => d.estado === estado);
    }

    renderizarTablaDocumentos(filtrados);
}

async function descargarDocumentoAdmin(id) {
    try {
        const doc = documentosData.find(d => d.id === id);
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/admin/documentos/${id}/descargar`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (handleAuthError(res.status)) throw new Error('Sesión expirada');
        if (!res.ok) throw new Error('Error al descargar');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc ? doc.nombreOriginal : 'documento';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        mostrarToastAdmin('Descarga iniciada', 'success');
    } catch (err) {
        mostrarToastAdmin('Error al descargar: ' + err.message, 'error');
    }
}

function abrirRevisarModal(id) {
    const doc = documentosData.find(d => d.id === id);
    if (!doc) return;

    documentoRevisandoId = id;

    const info = document.getElementById('revisarDocumentoInfo');
    const estadoLabels = { 'PENDIENTE': 'Pendiente', 'APROBADO': 'Aprobado', 'EN_OBSERVACION': 'En observación' };
    const estadoColors = {
        'PENDIENTE': 'bg-yellow-100 text-yellow-800',
        'APROBADO': 'bg-green-100 text-green-800',
        'EN_OBSERVACION': 'bg-red-100 text-red-800'
    };

    info.innerHTML = `
        <div class="grid grid-cols-2 gap-sm text-sm">
            <div><span class="text-on-surface-variant">Estudiante:</span> <span class="font-medium">${escapeHtml(doc.postulanteNombre + ' ' + doc.postulanteApellido)}</span></div>
            <div><span class="text-on-surface-variant">Documento:</span> <span class="font-medium">${escapeHtml(doc.nombreOriginal)}</span></div>
            <div><span class="text-on-surface-variant">Estado actual:</span> <span class="px-xs py-0.5 rounded text-xs ${estadoColors[doc.estado] || 'bg-gray-100'}">${estadoLabels[doc.estado] || doc.estado}</span></div>
            <div><span class="text-on-surface-variant">Fecha de envío:</span> <span class="font-medium">${new Date(doc.fechaSubida).toLocaleString('es-PE')}</span></div>
        </div>
    `;

    document.getElementById('observacionContainer').classList.add('hidden');
    document.getElementById('observacionInput').value = '';
    document.getElementById('observacionError').classList.add('hidden');
    document.getElementById('revisarModal').classList.remove('hidden');
}

function cambiarEstadoDoc(estado) {
    const container = document.getElementById('observacionContainer');

    if (estado === 'EN_OBSERVACION') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        document.getElementById('observacionError').classList.add('hidden');
        confirmarCambioEstado(estado);
    }
}

async function confirmarCambioEstado(estado) {
    const body = { estado };

    if (estado === 'EN_OBSERVACION') {
        const obs = document.getElementById('observacionInput').value.trim();
        if (!obs) {
            document.getElementById('observacionError').classList.remove('hidden');
            return;
        }
        body.observacion = obs;
    }

    try {
        await apiPut(`/api/admin/documentos/${documentoRevisandoId}/estado`, body);
        cerrarModal('revisarModal');
        await cargarDocumentosAdmin();
        mostrarToastAdmin('Estado actualizado exitosamente', 'success');
    } catch (err) {
        mostrarToastAdmin('Error al actualizar: ' + err.message, 'error');
    }
}

function guardarRevision() {
    const doc = documentosData.find(d => d.id === documentoRevisandoId);
    if (!doc) return;

    const container = document.getElementById('observacionContainer');
    if (!container.classList.contains('hidden')) {
        const obs = document.getElementById('observacionInput').value.trim();
        if (!obs) {
            document.getElementById('observacionError').classList.remove('hidden');
            return;
        }
        confirmarCambioEstado('EN_OBSERVACION');
    } else {
        mostrarToastAdmin('Seleccione un estado: Aprobado o En observación', 'warning');
    }
}

function mostrarToastAdmin(mensaje, tipo) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
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
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

function exportarCSV() {
    apiDownload('/api/reportes/csv', 'postulantes.csv').catch(err => {
        alert('Error al descargar CSV: ' + err.message);
    });
}

function exportarExcel() {
    apiDownload('/api/reportes/excel', 'postulantes.xlsx').catch(err => {
        alert('Error al descargar Excel: ' + err.message);
    });
}

function exportarPDF() {
    apiDownload('/api/reportes/pdf', 'postulantes.pdf').catch(err => {
        alert('Error al descargar PDF: ' + err.message);
    });
}

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    const body = {
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        nombres: formData.get('nombres'),
        apellidos: formData.get('apellidos'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        areaId: formData.get('areaId') ? parseInt(formData.get('areaId')) : null,
        carreraId: formData.get('carreraId') ? parseInt(formData.get('carreraId')) : null
    };

    try {
        await apiPut(`/api/postulantes/${editandoId}`, body);
        cerrarModal('editModal');
        await cargarDatos();
    } catch (err) {
        alert('Error al actualizar: ' + err.message);
    }
});
