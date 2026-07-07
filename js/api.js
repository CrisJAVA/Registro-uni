const API_BASE = 'http://localhost:8080';

function getToken() {
    return localStorage.getItem('token');
}

function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
    if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        location.href = 'login.html';
        throw new Error('No autorizado');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
        throw new Error(err.error || err.mensaje || 'Error en la solicitud');
    }
    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
        throw new Error(err.error || err.mensaje || JSON.stringify(err.messages || 'Error en la solicitud'));
    }
    return res.json();
}

async function apiPut(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
        throw new Error(err.error || err.mensaje || 'Error en la solicitud');
    }
    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
        throw new Error(err.error || err.mensaje || 'Error en la solicitud');
    }
}
