let postulantesData = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('adminAuth') !== 'true') {
        location.href = 'login.html';
        return;
    }
    cargarPostulantes();
});

function cargarPostulantes() {
    postulantesData = JSON.parse(localStorage.getItem('postulantes') || '[]');
    actualizarEstadisticas();
    poblarFiltroCarreras();
    renderizarTabla(postulantesData);
}

function actualizarEstadisticas() {
    document.getElementById('totalPostulantes').textContent = postulantesData.length;
    const carreras = new Set(postulantesData.map(p => p.carrera).filter(Boolean));
    const areas = new Set(postulantesData.map(p => p.areaPostulacion).filter(Boolean));
    document.getElementById('totalCarreras').textContent = carreras.size;
    document.getElementById('totalAreas').textContent = areas.size;
}

function poblarFiltroCarreras() {
    const select = document.getElementById('filterCarrera');
    const carreras = [...new Set(postulantesData.map(p => p.carrera).filter(Boolean))].sort();
    select.innerHTML = '<option value="">Todas</option>';
    carreras.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
}

function filtrarPostulantes() {
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    const area = document.getElementById('filterArea').value;
    const carrera = document.getElementById('filterCarrera').value;

    let filtrados = postulantesData.filter(p => {
        const coincideBusqueda = !busqueda ||
            (p.numeroDocumento && p.numeroDocumento.toLowerCase().includes(busqueda)) ||
            (p.nombres && p.nombres.toLowerCase().includes(busqueda)) ||
            (p.apellidos && p.apellidos.toLowerCase().includes(busqueda)) ||
            (p.email && p.email.toLowerCase().includes(busqueda));
        const coincideArea = !area || p.areaPostulacion === area;
        const coincideCarrera = !carrera || p.carrera === carrera;
        return coincideBusqueda && coincideArea && coincideCarrera;
    });

    renderizarTabla(filtrados);
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
            <td class="px-md py-sm text-on-surface-variant">${p.areaPostulacion || '-'}</td>
            <td class="px-md py-sm text-on-surface-variant">${p.carrera || '-'}</td>
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

function verPostulante(id) {
    const p = postulantesData.find(item => item.id === id);
    if (!p) return;

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
                <span class="font-label-md text-label-md text-on-surface-variant">Área de Postulación</span>
                <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.areaPostulacion || '-'}</span>
            </div>
            <div class="flex flex-col gap-xs">
                <span class="font-label-md text-label-md text-on-surface-variant">Carrera</span>
                <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.carrera || '-'}</span>
            </div>
            <div class="flex flex-col gap-xs">
                <span class="font-label-md text-label-md text-on-surface-variant">Fecha de Registro</span>
                <span class="font-body-md text-on-surface p-sm bg-surface-container-low rounded-lg">${p.fechaRegistro || '-'}</span>
            </div>
        </div>
    `;
    document.getElementById('viewModal').classList.remove('hidden');
}

function editarPostulante(id) {
    const p = postulantesData.find(item => item.id === id);
    if (!p) return;
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
                <label class="font-label-md text-label-md text-on-surface-variant">Área de Postulación</label>
                <select name="areaPostulacion" class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                    <option value="">Seleccione</option>
                    <option ${p.areaPostulacion === 'A - Ciencias de la Salud' ? 'selected' : ''}>A - Ciencias de la Salud</option>
                    <option ${p.areaPostulacion === 'B - Ciencias Básicas' ? 'selected' : ''}>B - Ciencias Básicas</option>
                    <option ${p.areaPostulacion === 'C - Ingenierías' ? 'selected' : ''}>C - Ingenierías</option>
                    <option ${p.areaPostulacion === 'D - Ciencias Económicas y de la Gestión' ? 'selected' : ''}>D - Ciencias Económicas y de la Gestión</option>
                    <option ${p.areaPostulacion === 'E - Humanidades y Ciencias Jurídicas' ? 'selected' : ''}>E - Humanidades y Ciencias Jurídicas</option>
                </select>
            </div>
            <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Carrera</label>
                <input name="carrera" value="${p.carrera || ''}"
                    class="w-full rounded-lg border-outline-variant bg-surface px-sm py-xs text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20" type="text"/>
            </div>
        </div>
    `;
    document.getElementById('editModal').classList.remove('hidden');
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

function eliminarPostulante(id) {
    postulantesData = postulantesData.filter(p => p.id !== id);
    localStorage.setItem('postulantes', JSON.stringify(postulantesData));
    cerrarModal('deleteModal');
    cargarPostulantes();
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function cerrarSesion() {
    localStorage.removeItem('adminAuth');
    location.href = 'index.html';
}

function exportarCSV() {
    const data = postulantesData.length > 0 ? postulantesData : [];
    if (data.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const headers = ['DNI', 'Nombres', 'Apellidos', 'Fecha Nacimiento', 'Sexo', 'Email', 'Telefono', 'Direccion', 'Departamento', 'Provincia', 'Distrito', 'Tipo Colegio', 'Area', 'Carrera', 'Fecha Registro'];
    const rows = data.map(p => [
        p.numeroDocumento || '',
        p.nombres || '',
        p.apellidos || '',
        p.fechaNacimiento || '',
        p.sexo || '',
        p.email || '',
        p.telefono || '',
        p.direccion || '',
        p.departamento || '',
        p.provincia || '',
        p.distrito || '',
        p.tipoColegio || '',
        p.areaPostulacion || '',
        p.carrera || '',
        p.fechaRegistro || ''
    ]);

    let csv = '\uFEFF' + headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `postulantes_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const index = postulantesData.findIndex(p => p.id === editandoId);
    if (index === -1) return;

    postulantesData[index].tipoDocumento = formData.get('tipoDocumento');
    postulantesData[index].numeroDocumento = formData.get('numeroDocumento');
    postulantesData[index].nombres = formData.get('nombres');
    postulantesData[index].apellidos = formData.get('apellidos');
    postulantesData[index].email = formData.get('email');
    postulantesData[index].telefono = formData.get('telefono');
    postulantesData[index].areaPostulacion = formData.get('areaPostulacion');
    postulantesData[index].carrera = formData.get('carrera');

    localStorage.setItem('postulantes', JSON.stringify(postulantesData));
    cerrarModal('editModal');
    cargarPostulantes();
});
