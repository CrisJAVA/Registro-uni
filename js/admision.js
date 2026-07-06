function verificarPago() {
    alert('Pago verificado correctamente. Redirigiendo al registro...');
    setTimeout(() => {
        location.href = 'registro.html';
    }, 1000);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.add('hidden');
    }
});
