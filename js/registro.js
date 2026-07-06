function handleAreaChange(value) {
    const careerContainer = document.getElementById('carreraContainer');
    if (value === 'A') {
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
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Procesando registro del postulante...');
        });
    }
});
