function handleAreaChange(value) {
    const careerContainer = document.getElementById('carreraContainer');
    const carreraSelect = careerContainer ? careerContainer.querySelector('select') : null;

    const careers = {
        'A': ['Medicina Humana', 'Enfermería', 'Odontología', 'Farmacia y Bioquímica', 'Psicología', 'Nutrición'],
        'B': ['Biología', 'Química', 'Física', 'Matemática'],
        'C': ['Ingeniería de Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Ambiental'],
        'D': ['Administración', 'Contabilidad', 'Economía', 'Marketing'],
        'E': ['Derecho', 'Ciencias Políticas', 'Comunicación', 'Educación']
    };

    if (value && careers[value]) {
        if (carreraSelect) {
            carreraSelect.innerHTML = '<option value="">Seleccione su carrera</option>';
            careers[value].forEach(c => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                carreraSelect.appendChild(opt);
            });
        }
        careerContainer.classList.remove('hidden');
        setTimeout(() => {
            careerContainer.classList.remove('translate-y-2', 'opacity-0');
            careerContainer.classList.add('translate-y-0', 'opacity-100');
        }, 10);
    } else {
        careerContainer.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => {
            careerContainer.classList.add('hidden');
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {};

            data.tipoDocumento = formData.get('tipoDocumento') || 'DNI';
            data.numeroDocumento = form.querySelector('input[placeholder="Ej. 70123456"]') ? form.querySelector('input[placeholder="Ej. 70123456"]').value : '';
            data.nombres = form.querySelector('input[placeholder="Ingresa tus nombres"]') ? form.querySelector('input[placeholder="Ingresa tus nombres"]').value : '';
            data.apellidos = form.querySelector('input[placeholder="Ingresa tus apellidos completos"]') ? form.querySelector('input[placeholder="Ingresa tus apellidos completos"]').value : '';
            data.fechaNacimiento = form.querySelector('input[type="date"]') ? form.querySelector('input[type="date"]').value : '';
            data.sexo = formData.get('sexo') || '';
            data.email = form.querySelector('input[type="email"]') ? form.querySelector('input[type="email"]').value : '';
            data.telefono = form.querySelector('input[type="tel"]') ? form.querySelector('input[type="tel"]').value : '';
            data.direccion = form.querySelector('input[placeholder="Av. Principal 123 - Urb. Los Sauces"]') ? form.querySelector('input[placeholder="Av. Principal 123 - Urb. Los Sauces"]').value : '';
            data.departamento = form.querySelectorAll('select')[1] && form.querySelectorAll('select')[1].value !== 'Seleccionar' ? form.querySelectorAll('select')[1].value : '';
            data.provincia = form.querySelectorAll('select')[2] && form.querySelectorAll('select')[2].value !== 'Seleccionar' ? form.querySelectorAll('select')[2].value : '';
            data.distrito = form.querySelectorAll('select')[3] && form.querySelectorAll('select')[3].value !== 'Seleccionar' ? form.querySelectorAll('select')[3].value : '';
            data.tipoColegio = formData.get('tipo_colegio') || '';
            data.areaPostulacion = document.getElementById('areaPostulacion') ? document.getElementById('areaPostulacion').value : '';
            data.carrera = form.querySelector('#carreraContainer select') ? form.querySelector('#carreraContainer select').value : '';
            data.fechaRegistro = new Date().toLocaleDateString('es-PE');
            data.id = Date.now();

            let postulantes = JSON.parse(localStorage.getItem('postulantes') || '[]');
            postulantes.push(data);
            localStorage.setItem('postulantes', JSON.stringify(postulantes));

            alert('Registro exitoso. Redirigiendo al panel de administración...');
            setTimeout(() => {
                location.href = 'admin.html';
            }, 1500);
        });
    }
});
