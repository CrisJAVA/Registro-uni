let areasData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAreas();

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleRegistration);
    }
});

async function loadAreas() {
    try {
        areasData = await apiGet('/api/areas');
        const select = document.getElementById('areaPostulacion');
        if (select) {
            select.innerHTML = '<option value="">Seleccione un área</option>';
            areasData.forEach(area => {
                const opt = document.createElement('option');
                opt.value = area.id;
                opt.textContent = area.nombre;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('Error al cargar áreas:', err);
    }
}

async function handleAreaChange(areaId) {
    const careerContainer = document.getElementById('carreraContainer');
    const carreraSelect = careerContainer ? careerContainer.querySelector('select') : null;

    if (!areaId) {
        careerContainer.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => careerContainer.classList.add('hidden'), 300);
        return;
    }

    try {
        const carreras = await apiGet(`/api/carreras?areaId=${areaId}`);
        if (carreraSelect) {
            carreraSelect.innerHTML = '<option value="">Seleccione su carrera</option>';
            carreras.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.nombre;
                carreraSelect.appendChild(opt);
            });
        }
        careerContainer.classList.remove('hidden');
        setTimeout(() => {
            careerContainer.classList.remove('translate-y-2', 'opacity-0');
            careerContainer.classList.add('translate-y-0', 'opacity-100');
        }, 10);
    } catch (err) {
        console.error('Error al cargar carreras:', err);
    }
}

async function handleRegistration(e) {
    e.preventDefault();
    const form = e.target;

    const tipoDocumento = document.getElementById('tipoDocumento')?.value || 'DNI';
    const numeroDocumento = document.getElementById('numeroDocumento')?.value || '';
    const nombres = document.getElementById('nombres')?.value || '';
    const apellidos = document.getElementById('apellidos')?.value || '';
    const fechaNacimiento = document.getElementById('fechaNacimiento')?.value || null;
    const sexoRadio = form.querySelector('input[name="sexo"]:checked');
    const sexo = sexoRadio ? sexoRadio.value : '';
    const email = document.getElementById('email')?.value || '';
    const telefono = document.getElementById('telefono')?.value || '';
    const direccion = document.getElementById('direccion')?.value || '';
    const departamento = document.getElementById('departamento')?.value || '';
    const provincia = document.getElementById('provincia')?.value || '';
    const distrito = document.getElementById('distrito')?.value || '';
    const tipoColegioRadio = form.querySelector('input[name="tipo_colegio"]:checked');
    const tipoColegio = tipoColegioRadio ? tipoColegioRadio.value : '';
    const areaSelect = document.getElementById('areaPostulacion');
    const areaId = areaSelect && areaSelect.value ? parseInt(areaSelect.value) : null;
    const carreraSelect = document.querySelector('#carreraContainer select');
    const carreraId = carreraSelect && carreraSelect.value ? parseInt(carreraSelect.value) : null;

    if (!nombres || !apellidos) {
        alert('Los nombres y apellidos son obligatorios.');
        return;
    }

    const body = {
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        fechaNacimiento: fechaNacimiento || null,
        sexo,
        email,
        telefono,
        direccion,
        departamento,
        provincia,
        distrito,
        tipoColegio,
        areaId,
        carreraId
    };

    try {
        await apiPost('/api/postulantes/registrar', body);
        alert('Registro exitoso. Redirigiendo al panel de administración...');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    } catch (err) {
        alert('Error al registrar: ' + err.message);
    }
}
