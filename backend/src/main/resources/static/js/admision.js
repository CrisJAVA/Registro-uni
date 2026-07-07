function filtrarSoloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = mensaje;
        el.classList.remove('hidden');
    }
}

function ocultarError(id) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = '';
        el.classList.add('hidden');
    }
}

function validarVerificacion(valor) {
    if (!valor) {
        mostrarError('errorVerificacion', 'El código de verificación es obligatorio');
        return false;
    }
    if (!/^\d{1,8}$/.test(valor)) {
        mostrarError('errorVerificacion', 'Solo números, máximo 8 dígitos');
        return false;
    }
    ocultarError('errorVerificacion');
    return true;
}

function validarMovimiento(valor) {
    if (!valor) {
        mostrarError('errorMovimiento', 'El número de movimiento es obligatorio');
        return false;
    }
    if (!/^\d{7}$/.test(valor)) {
        mostrarError('errorMovimiento', 'Debe ser exactamente 7 dígitos numéricos');
        return false;
    }
    ocultarError('errorMovimiento');
    return true;
}

function verificarPago() {
    const verInput = document.getElementById('pagoVerificacion');
    const movInput = document.getElementById('pagoMovimiento');
    const entidadSelect = document.getElementById('pagoEntidad');
    const montoInput = document.getElementById('pagoMonto');
    const fechaInput = document.getElementById('pagoFecha');

    const verificacion = verInput ? verInput.value.trim() : '';
    const movimiento = movInput ? movInput.value.trim() : '';

    const verValido = validarVerificacion(verificacion);
    const movValido = validarMovimiento(movimiento);

    if (!verValido || !movValido) {
        return;
    }

    const body = {
        numeroVerificacion: verificacion,
        numeroMovimiento: movimiento,
        entidadFinanciera: entidadSelect ? entidadSelect.value : '',
        monto: montoInput ? parseFloat(montoInput.value) || null : null,
        fechaPago: fechaInput ? fechaInput.value || null : null
    };

    apiPost('/api/pagos/validar', body)
        .then(data => {
            if (data.estado === 'NO_ENCONTRADO') {
                alert(data.mensaje || 'El número de movimiento no fue encontrado.');
            } else if (data.estado === 'VALIDADO' || data.estado === 'CONFIRMADO') {
                alert('Pago validado correctamente. Redirigiendo al registro...');
                localStorage.setItem('pagoValidado', 'true');
                localStorage.setItem('pagoData', JSON.stringify(data));
                setTimeout(() => {
                    window.location.href = 'registro.html';
                }, 1000);
            } else {
                alert(`Estado del pago: ${data.estado}. ${data.mensaje || ''}`);
            }
        })
        .catch(err => {
            alert(err.message || 'Error al conectar con el servidor.');
        });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.add('hidden');
    }
});
