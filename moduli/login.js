// ================================================================
// MODULO: LOGIN
// ================================================================

import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

(function() {
    const css = `
        .login-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #1a6e3a 0%, #ce2b37 100%);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: white;
            padding: 40px 35px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 420px;
        }
        .login-box h2 {
            color: #1a6e3a;
            margin: 0 0 5px;
            font-size: 1.8rem;
        }
        .login-box .login-subtitle {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 20px;
        }
        .login-box input {
            width: 100%;
            padding: 14px;
            margin: 10px 0;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            box-sizing: border-box;
            background: #f8f8f8;
        }
        .login-box input:focus {
            border-color: #1a6e3a;
            outline: none;
        }
        .login-box button {
            background: #1a6e3a;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            width: 100%;
            cursor: pointer;
            margin-top: 10px;
        }
        .login-error {
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 10px;
            display: none;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

let dbGlobal = null;

export function initLogin(app) {
    dbGlobal = app;
}

export async function getGruppi() {
    if (!dbGlobal) return [];
    const database = getDatabase(dbGlobal);
    const gruppiRef = ref(database, 'gruppi');

    try {
        const snap = await get(gruppiRef);
        if (!snap.exists()) return [];
        const data = snap.val();
        return Object.keys(data).map(id => ({
            id,
            nome: data[id].nome_visibile || id
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function cercaUtente(username, password) {
    if (!dbGlobal) return null;

    const database = getDatabase(dbGlobal);
    const gruppiSnap = await get(ref(database, 'gruppi'));
    if (!gruppiSnap.exists()) return null;

    const gruppi = gruppiSnap.val();

    for (const gruppoId of Object.keys(gruppi)) {
        const gruppo = gruppi[gruppoId];

        const sezioni = [
            { tipo: 'studenti', dati: gruppo.studenti || {} },
            { tipo: 'docenti', dati: gruppo.docenti || {} }
        ];

        for (const sezione of sezioni) {
            for (const nomeUtente of Object.keys(sezione.dati)) {
                const utente = sezione.dati[nomeUtente];
                if (nomeUtente === username && utente.password === password) {
                    return {
                        username: nomeUtente,
                        gruppo: gruppoId,
                        nomeGruppo: gruppo.nome_visibile || gruppoId,
                        livello: utente.livello || 0,
                        email: utente.email || '',
                        ruolo: sezione.tipo
                    };
                }
            }
        }
    }

    return null;
}

export function haAccesso(utente, unitaNumero) {
    if (!utente) return false;
    return (utente.livello || 0) >= unitaNumero;
}

export async function mostraLogin(onSuccess) {
    const overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.className = 'login-overlay';

    overlay.innerHTML = `
        <div class="login-box">
            <h2>🇮🇹 Benvenuti in classe!</h2>
            <p class="login-subtitle">Inserisci username e password</p>

            <input type="text" id="login-username" placeholder="Nome utente">
            <input type="password" id="login-password" placeholder="Password">

            <div id="login-error" class="login-error"></div>

            <button id="login-button">Entra</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const btn = document.getElementById('login-button');
    const errorEl = document.getElementById('login-error');

    const login = async () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            errorEl.textContent = 'Inserisci username e password';
            errorEl.style.display = 'block';
            return;
        }

        errorEl.style.display = 'none';
        btn.textContent = '⏳ Verifica...';
        btn.disabled = true;

        const utente = await cercaUtente(username, password);

        btn.textContent = 'Entra';
        btn.disabled = false;

        if (utente) {
            localStorage.setItem('parlo_italiano_utente', JSON.stringify(utente));
            overlay.remove();
            if (onSuccess) onSuccess(utente);
        } else {
            errorEl.textContent = '❌ Credenziali non valide';
            errorEl.style.display = 'block';
        }
    };

    btn.addEventListener('click', login);

    document.getElementById('login-username').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') login();
    });
    document.getElementById('login-password').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') login();
    });
}

export function getUtenteCorrente() {
    const data = localStorage.getItem('parlo_italiano_utente');
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function nascondiLogin() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.remove();
}

export function logout() {
    localStorage.removeItem('parlo_italiano_utente');
    window.location.reload();
}