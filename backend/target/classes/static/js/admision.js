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

function verificarPago() {
    const codigoInput = document.getElementById('pagoCodigo');
    const movInput = document.getElementById('pagoMovimiento');
    const montoInput = document.getElementById('pagoMonto');
    const fechaInput = document.getElementById('pagoFecha');

    const codigo = codigoInput ? codigoInput.value.trim() : '';
    const numeroMovimiento = movInput ? movInput.value.trim() : '';

    ocultarError('errorCodigo');
    ocultarError('errorMovimiento');
    ocultarError('errorGeneral');

    if (!codigo || !numeroMovimiento) {
        mostrarError('errorGeneral', 'Ingrese el código de verificación y el número de movimiento.');
        return;
    }

    if (!/^\d{1,8}$/.test(codigo) || !/^\d{6}$/.test(numeroMovimiento)) {
        mostrarError('errorGeneral', 'Datos de pago inválidos.');
        return;
    }

    const btn = document.querySelector('#payment-modal button[onclick="verificarPago()"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Verificando...';
    }

    apiPost('/api/pagos/verificar', { codigo, numeroMovimiento })
        .then(data => {
            if (!data.encontrado) {
                mostrarError('errorGeneral', data.mensaje || 'Pago no encontrado.');
                if (montoInput) montoInput.value = '';
                if (fechaInput) fechaInput.value = '';
            } else {
                ocultarError('errorGeneral');
                if (montoInput) montoInput.value = data.monto || '';
                if (fechaInput && data.fechaPago) {
                    fechaInput.value = data.fechaPago;
                }
                localStorage.setItem('pagoValidado', 'true');
                localStorage.setItem('pagoData', JSON.stringify(data));
                alert('Pago encontrado. Redirigiendo al registro...');
                setTimeout(() => {
                    window.location.href = 'registro.html';
                }, 1000);
            }
        })
        .catch(err => {
            mostrarError('errorGeneral', 'Error al conectar con el servidor.');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Verificar Pago';
            }
        });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.add('hidden');
    }
});
