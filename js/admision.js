function verificarPago() {
    const numOpInput = document.getElementById('pagoNumOperacion') || document.querySelector('#payment-modal input[placeholder="Ej. 123456789"]');
    const entidadSelect = document.getElementById('pagoEntidad');
    const montoInput = document.getElementById('pagoMonto');
    const fechaInput = document.getElementById('pagoFecha');

    const numOperacion = numOpInput ? numOpInput.value.trim() : '';
    if (!numOperacion) {
        alert('Ingrese el número de operación.');
        return;
    }

    const body = {
        numeroOperacion: numOperacion,
        entidadFinanciera: entidadSelect ? entidadSelect.value : '',
        monto: montoInput ? parseFloat(montoInput.value) || null : null,
        fechaPago: fechaInput ? fechaInput.value || null : null
    };

    fetch(`${API_BASE}/api/pagos/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) return res.json().then(e => { throw new Error(e.error || e.mensaje || 'Error al validar pago'); });
        return res.json();
    })
    .then(data => {
        if (data.estado === 'NO_ENCONTRADO') {
            alert(data.mensaje || 'El número de operación no fue encontrado.');
        } else if (data.estado === 'VALIDADO' || data.estado === 'CONFIRMADO') {
            alert('Pago validado correctamente. Redirigiendo al registro...');
            localStorage.setItem('pagoValidado', 'true');
            localStorage.setItem('pagoData', JSON.stringify(data));
            setTimeout(() => {
                location.href = 'registro.html';
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
