const API_BASE = (window.location.hostname === 'localhost' && window.location.port === '8080')
    ? ''
    : 'http://localhost:8080';

function getToken() {
    return localStorage.getItem('token');
}

function authHeaders() {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function handleAuthError(status) {
    if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return true;
    }
    return false;
}

async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'GET',
        headers: authHeaders()
    });

    if (handleAuthError(res.status)) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error HTTP ${res.status}` }));
        throw new Error(err.error || err.mensaje || `Error en la solicitud (${res.status})`);
    }

    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });

    if (handleAuthError(res.status)) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error HTTP ${res.status}` }));
        const messages = err.messages ? Object.values(err.messages).join('. ') : '';
        throw new Error(err.error || err.mensaje || messages || `Error en la solicitud (${res.status})`);
    }

    return res.json();
}

async function apiPut(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });

    if (handleAuthError(res.status)) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error HTTP ${res.status}` }));
        throw new Error(err.error || err.mensaje || `Error en la solicitud (${res.status})`);
    }

    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: authHeaders()
    });

    if (handleAuthError(res.status)) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error HTTP ${res.status}` }));
        throw new Error(err.error || err.mensaje || `Error en la solicitud (${res.status})`);
    }
}

async function apiDownload(path, filename) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'GET',
        headers: authHeaders()
    });

    if (handleAuthError(res.status)) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
    }

    if (!res.ok) {
        throw new Error(`Error al descargar archivo (${res.status})`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
