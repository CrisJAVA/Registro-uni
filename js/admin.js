let postulantesData = [];
let editandoId = null;
let areasCache = [];
let carrerasCache = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) {
        location.href = 'login.html';
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
        alert('Error al cargar datos. Verifique que el servidor esté activo.');
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
            <td class="px-md py-sm text-on-surface font-medium">${p.numeroDocumento || '-'}</td>
            <td class="px-md py-sm text-on-surface">${p.nombres || '-'}</td>
            <td class="px-md py-sm text-on-surface">${p.apellidos || '-'}</td>
            <td class="px-md py-sm text-on-surface-variant">${p.areaNombre || '-'}</td>
            <td class="px-md py-sm text-on-surface-variant">${p.carreraNombre || '-'}</td>
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

async function verPostulante(id) {
    try {
        const p = await apiGet(`/api/postulantes/${id}`);
        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Tipo de Documento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.tipoDocumento || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Número de Documento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.numeroDocumento || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Nombres</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.nombres || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Apellidos</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.apellidos || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Fecha de Nacimiento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.fechaNacimiento || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Sexo</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.sexo || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Correo Electrónico</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.email || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Teléfono</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.telefono || '-'}</span>
                </div>
                <div class="md:col-span-2 flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Dirección</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.direccion || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Departamento</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.departamento || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Provincia</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.provincia || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Distrito</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.distrito || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Tipo de Colegio</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.tipoColegio || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Área</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.areaNombre || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Carrera</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.carreraNombre || '-'}</span>
                </div>
                <div class="flex flex-col gap-xs">
                    <span class="font-label-md text-label-md text-on-surface-variant">Fecha de Registro</span>
                    <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.fechaRegistro || '-'}</span>
                </div>
            </div>
        `;
        document.getElementById('viewModal').classList.remove('hidden');
    } catch (err) {
        alert('Error al obtener datos del postulante.');
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
                    <input name="numeroDocumento" value="${p.numeroDocumento || ''}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Nombres</label>
                    <input name="nombres" value="${p.nombres || ''}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Apellidos</label>
                    <input name="apellidos" value="${p.apellidos || ''}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Correo Electrónico</label>
                    <input name="email" value="${p.email || ''}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="email"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Teléfono</label>
                    <input name="telefono" value="${p.telefono || ''}"
                        class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="tel"/>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Área</label>
                    <select name="areaId" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                        <option value="">Seleccione</option>
                        ${areasCache.map(a => `<option value="${a.id}" ${p.areaId === a.id ? 'selected' : ''}>${a.nombre}</option>`).join('')}
                    </select>
                </div>
                <div class="flex flex-col gap-xs">
                    <label class="font-label-md text-label-md text-on-surface-variant">Carrera</label>
                    <select name="carreraId" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                        <option value="">Seleccione</option>
                        ${carrerasCache.map(c => `<option value="${c.id}" ${p.carreraId === c.id ? 'selected' : ''}>${c.nombre}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
        document.getElementById('editModal').classList.remove('hidden');
    } catch (err) {
        alert('Error al cargar datos del postulante.');
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

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    location.href = 'index.html';
}

function exportarCSV() {
    window.open(`${API_BASE}/api/reportes/csv`, '_blank');
}

function exportarExcel() {
    window.open(`${API_BASE}/api/reportes/excel`, '_blank');
}

function exportarPDF() {
    window.open(`${API_BASE}/api/reportes/pdf`, '_blank');
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
