let areasData = [];

const ubigeo = {
    "Lima": {
        "Lima": ["Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "Jesús María", "La Molina", "La Victoria", "Lima", "Lince", "Los Olivos", "Magdalena del Mar", "Magdalena Vieja", "Miraflores", "Pachacámac", "Pachacamac", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Martín de Porres", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surco", "Villa El Salvador", "Villa María del Triunfo"],
        "Cañete": "San Vicente de Cañete",
        "Canta": "Canta",
        "Huaral": "Huaral",
        "Huarochirí": "Matucana",
        "Oyón": "Oyón",
        "Yauyos": "Yauyos"
    },
    "Arequipa": {
        "Arequipa": ["Alto Selva Alegre", "Cayma", "Cerro Colorado", "Characato", "Chiguata", "Jacobo Hunter", "La Joya", "Mariano Melgar", "Miraflores", "Mollebaya", "Paucarpata", "Pocsi", "Polobaya", "Quequeña", "Sabandía", "Sachaca", "San Juan de Siguas", "San Juan de Tarucani", "Santa Isabel de Siguas", "Santa Rita de Siguas", "Socabaya", "Tiabaya", "Uchumayo", "Vítor", "Yanahuara", "Yarabamba", "Yura"],
        "Camana": "Camana",
        "Caravelí": "Caravelí",
        "Castilla": "Aplao",
        "Caylloma": "Chivay",
        "Condesuyos": "Chuquibamba",
        "Islay": "Mollendo",
        "La Unión": "Cotahuasi"
    },
    "La Libertad": {
        "Trujillo": ["Trujillo", "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo", "Moche", "Poroto", "Salaverry", "Simbal", "Víctor Larco Herrera"],
        "Ascope": "Ascope",
        "Bolívar": "Bambamarca",
        "Chepén": "Chepén",
        "Julcán": "Julcán",
        "Otuzco": "Otuzco",
        "Pacasmayo": "San Pedro de Lloc",
        "Pataz": "Tayabamba",
        "Sánchez Carrión": "Huamachuco",
        "Santiago de Chuco": "Santiago de Chuco",
        "Gran Chimú": "Cascas",
        "Virú": "Virú"
    },
    "Ica": {
        "Ica": ["Ica", "La Tinguiña", "Los Aquijes", "Ocucaje", "Pachacutec", "Parcona", "Pueblo Nuevo", "Salas", "San José de Los Molinos", "San Juan Bautista", "Santiago", "Subtanjalla", "Tate", "Yauca del Rosario"],
        "Chincha": "Chincha Alta",
        "Nazca": "Nazca",
        "Palpa": "Palpa",
        "Pisco": "Pisco"
    }
};

function filtrarSoloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function cargarProvincias(departamento) {
    const provinciaSelect = document.getElementById('provincia');
    const distritoSelect = document.getElementById('distrito');

    provinciaSelect.innerHTML = '<option value="">Seleccionar</option>';
    distritoSelect.innerHTML = '<option value="">Seleccionar</option>';

    if (departamento && ubigeo[departamento]) {
        Object.keys(ubigeo[departamento]).forEach(provincia => {
            const opt = document.createElement('option');
            opt.value = provincia;
            opt.textContent = provincia;
            provinciaSelect.appendChild(opt);
        });
    }
}

function cargarDistritos(provincia) {
    const distritoSelect = document.getElementById('distrito');
    const departamento = document.getElementById('departamento').value;

    distritoSelect.innerHTML = '<option value="">Seleccionar</option>';

    if (departamento && provincia && ubigeo[departamento] && ubigeo[departamento][provincia]) {
        const distritos = ubigeo[departamento][provincia];
        const distritosArray = Array.isArray(distritos) ? distritos : [distritos];
        distritosArray.forEach(distrito => {
            const opt = document.createElement('option');
            opt.value = distrito;
            opt.textContent = distrito;
            distritoSelect.appendChild(opt);
        });
    }
}

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

    const errorDoc = document.getElementById('errorNumeroDocumento');
    if (errorDoc) { errorDoc.textContent = ''; errorDoc.classList.add('hidden'); }

    if (tipoDocumento === 'DNI' && !/^\d{8}$/.test(numeroDocumento)) {
        if (errorDoc) {
            errorDoc.textContent = 'El DNI debe contener exactamente 8 dígitos numéricos.';
            errorDoc.classList.remove('hidden');
        }
        return;
    }

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
