// ================================================================
// MODULO: LAVAGNA WHITEBOARD
// ================================================================

import { getDatabase, ref, onValue, runTransaction, update, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

(function() {
    // Carica Google Font "Caveat" per effetto scrittura a mano
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap';
    document.head.appendChild(fontLink);

    const css = `
        .lavagna-container {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid var(--primary-color, #1a6e3a);
        }
        .lavagna-titolo {
            font-weight: bold;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 10px;
            font-size: 1rem;
        }
        .lavagna-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 14px;
            padding: 10px 12px;
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.9rem;
            font-weight: bold;
            background: #e8f5e9;
            color: #1a6e3a;
        }
        .status-badge.occupata {
            background: #fdecea;
            color: #c0392b;
        }
        .writer-name {
            font-weight: bold;
            color: var(--secondary-color, #ce2b37);
            font-size: 0.9rem;
        }
        .lavagna-azioni {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .lavagna-azioni button {
            border: none;
            border-radius: 8px;
            padding: 9px 12px;
            cursor: pointer;
            font-weight: bold;
            color: white;
            background: var(--primary-color, #1a6e3a);
            transition: all 0.2s;
            font-size: 0.9rem;
            white-space: nowrap;
        }
        .lavagna-azioni button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .lavagna-azioni button.secondary {
            background: var(--secondary-color, #ce2b37);
        }

        /* ===== STILE WHITEBOARD ===== */
        .lavagna-board {
            min-height: 200px;
            padding: 25px 30px;
            font-family: 'Caveat', 'Patrick Hand', 'Comic Sans MS', cursive;
            font-size: 2em;
            font-weight: 700;
            line-height: 1.8;
            
            /* Sfondo lavagna verde scuro */
            background: #2d4a3e;
            background-image: 
                radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 50%);
            
            /* Testo bianco effetto gesso più marcato */
            color: #f5f5f0;
            text-shadow: 0 1px 3px rgba(255,255,255,0.25), 0 0 1px rgba(255,255,255,0.1);
            
            /* Bordo effetto legno */
            border: 8px solid #8B5E3C;
            border-radius: 4px;
            box-shadow: 
                inset 0 0 30px rgba(0,0,0,0.3),
                0 4px 14px rgba(0,0,0,0.3),
                0 0 0 2px #6B3F2A;
            
            white-space: pre-wrap;
            word-break: break-word;
            transition: all 0.3s ease;
        }

        /* Cursore a pennarello quando editabile */
        .lavagna-board[contenteditable="true"] {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32"><rect x="8" y="2" width="8" height="20" rx="4" fill="%23FF6B35" stroke="%23CC5522" stroke-width="1.5"/><polygon points="8,22 12,30 16,22" fill="%23FF6B35" stroke="%23CC5522" stroke-width="1"/></svg>') 12 2, text;
            background: #2a4538;
            box-shadow: 
                inset 0 0 40px rgba(0,0,0,0.4),
                0 4px 20px rgba(0,0,0,0.4),
                0 0 0 2px #6B3F2A,
                0 0 20px rgba(255,107,53,0.2);
        }

        .lavagna-board:focus {
            outline: none;
            box-shadow: 
                inset 0 0 40px rgba(0,0,0,0.4),
                0 4px 20px rgba(0,0,0,0.4),
                0 0 0 2px #6B3F2A,
                0 0 30px rgba(255,107,53,0.3);
        }

        .lavagna-board[contenteditable="false"] {
            cursor: default;
            background: #2d4a3e;
            opacity: 0.95;
        }

        /* Placeholder stile gesso */
        .lavagna-board:empty:before {
            content: attr(data-placeholder);
            color: rgba(245, 245, 240, 0.5);
            font-style: italic;
            font-family: 'Caveat', 'Patrick Hand', 'Comic Sans MS', cursive;
            font-weight: 400;
        }

        .lavagna-notify {
            margin-top: 8px;
            font-weight: bold;
            color: var(--secondary-color, #ce2b37);
            text-align: center;
            min-height: 22px;
            font-size: 0.9rem;
        }

        /* ===== RESPONSIVE LAVAGNA ===== */
        @media (max-width: 600px) {
            .lavagna-container {
                padding: 12px;
                margin: 15px 0;
            }
            
            .lavagna-toolbar {
                flex-direction: column;
                align-items: stretch;
                gap: 8px;
                padding: 8px 10px;
            }
            
            .lavagna-azioni {
                width: 100%;
            }
            
            .lavagna-azioni button {
                flex: 1;
                padding: 10px 8px;
                font-size: 0.85rem;
            }
            
            .status-badge {
                text-align: center;
                width: 100%;
            }
            
            .writer-name {
                display: block;
                text-align: center;
            }
            
            .lavagna-board {
                font-size: 1.5em;
                padding: 20px 18px;
                min-height: 160px;
                border-width: 6px;
            }
        }
        
        @media (max-width: 400px) {
            .lavagna-board {
                font-size: 1.3em;
                padding: 15px 14px;
                min-height: 140px;
                border-width: 5px;
            }
            
            .lavagna-azioni {
                flex-direction: column;
            }
            
            .lavagna-azioni button {
                width: 100%;
                padding: 8px 6px;
                font-size: 0.8rem;
            }
            
            .lavagna-titolo {
                font-size: 0.9rem;
            }
            
            .lavagna-notify {
                font-size: 0.8rem;
            }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

let dbGlobalApp = null;
let BASE_PATH_GLOBAL = '';
const LOCK_TIMEOUT_MS = 10 * 60 * 1000;
const AUTO_SAVE_DEBOUNCE_MS = 500;
const saveTimers = {};
const tokenCache = {};

function getDatabaseInstance() {
    if (!dbGlobalApp) return null;
    return getDatabase(dbGlobalApp);
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('parlo_italiano_utente') || '{}');
    } catch {
        return {};
    }
}

function now() {
    return Date.now();
}

function sessionKey(id) {
    return `lavagna_session_${id}`;
}

export function initLavagna(app) {
    dbGlobalApp = app;
    console.log('📦 lavagna: database inizializzato');
}

export function generaLavagna(config) {
    const id = config?.id || 'lavagna_generica';
    const placeholder = config?.placeholder || 'Scrivi qui...';
    const titolo = config?.titolo || 'Lavagna';

    return `
    <div class="lavagna-container" id="lavagna_${id}">
        <div class="lavagna-toolbar">
            <div>
                <span id="status_${id}" class="status-badge">Disponibile 🟢</span>
                <span id="writer_${id}" class="writer-name"></span>
            </div>
            <div class="lavagna-azioni">
                <button type="button" id="btn_prendi_${id}" onclick="window.prendiPennarello('${id}')">✏️ Prendi marker</button>
                <button type="button" id="btn_rilascia_${id}" onclick="window.rilasciaPennarello('${id}')" style="display:none;">🔓 Rilascia marker</button>
                <button type="button" id="btn_libera_${id}" class="secondary" onclick="window.forzaLiberaLavagna('${id}')" style="display:none;">⏱️ Libera</button>
            </div>
        </div>

        <div class="lavagna-titolo">
            ${titolo}
        </div>

        <div id="board_${id}" class="lavagna-board" contenteditable="false" data-placeholder="${placeholder}"></div>
        <div id="notify_${id}" class="lavagna-notify"></div>
    </div>
    `;
}

export function avviaLavagnaListener(basePath, id, isDocente, myUserName, mySessionId) {
    const database = getDatabaseInstance();
    if (!database) {
        console.error('❌ Lavagna: database non inizializzato!');
        return;
    }

    BASE_PATH_GLOBAL = basePath;

    const tokenRef = ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}/token`);
    const contentRef = ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}/content`);

    const board = document.getElementById(`board_${id}`);
    const status = document.getElementById(`status_${id}`);
    const writer = document.getElementById(`writer_${id}`);
    const btnPrendi = document.getElementById(`btn_prendi_${id}`);
    const btnRilascia = document.getElementById(`btn_rilascia_${id}`);
    const btnLibera = document.getElementById(`btn_libera_${id}`);
    const notify = document.getElementById(`notify_${id}`);

    if (!board) {
        console.error(`❌ Lavagna: board_${id} non trovato nel DOM`);
        return;
    }

    console.log(`✅ Lavagna listener avviato per ${id}`);

    const isOwner = (token) => {
        const user = getCurrentUser();
        const mySession = localStorage.getItem(sessionKey(id));
        return !!token && (
            token.sessionId === mySession ||
            token.userId === user.username ||
            token.userId === myUserName ||
            token.sessionId === mySessionId ||
            isDocente
        );
    };

    const refreshUI = (token) => {
        const owner = token && isOwner(token);

        if (!token) {
            status.textContent = 'Disponibile 🟢';
            status.classList.remove('occupata');
            writer.textContent = '';
            notify.textContent = '';
            btnPrendi.style.display = 'inline-block';
            btnPrendi.disabled = false;
            btnRilascia.style.display = 'none';
            btnLibera.style.display = isDocente ? 'inline-block' : 'none';
            board.contentEditable = 'false';
            return;
        }

        if (token.expiresAt && token.expiresAt < now()) {
            releaseLock(id, true);
            return;
        }

        status.textContent = 'Occupata 🔴';
        status.classList.add('occupata');
        writer.textContent = `Sta scrivendo: ${token.username || 'Studente'}`;
        
        if (owner) {
            notify.textContent = 'Stai scrivendo tu! ✍️';
            btnPrendi.style.display = 'none';
            btnRilascia.style.display = 'inline-block';
            btnLibera.style.display = isDocente ? 'inline-block' : 'none';
            board.contentEditable = 'true';
            board.focus();
        } else {
            notify.textContent = `${token.username || 'Uno studente'} sta scrivendo`;
            btnPrendi.style.display = 'inline-block';
            btnPrendi.disabled = true;
            btnRilascia.style.display = 'none';
            btnLibera.style.display = isDocente ? 'inline-block' : 'none';
            board.contentEditable = 'false';
        }
    };

    onValue(tokenRef, (snap) => {
        const token = snap.val();
        tokenCache[id] = token;
        refreshUI(token);
    });

    onValue(contentRef, (snap) => {
        const data = snap.val();
        if (data && typeof data.html === 'string' && board.innerHTML !== data.html) {
            board.innerHTML = data.html;
        }
    });

    board.addEventListener('input', () => {
        const token = tokenCache[id];
        if (!token) return;

        if (!isOwner(token)) return;

        clearTimeout(saveTimers[id]);
        saveTimers[id] = setTimeout(() => {
            set(ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}/content`), {
                html: board.innerHTML,
                savedAt: now()
            });
        }, AUTO_SAVE_DEBOUNCE_MS);
    });
}

window.prendiPennarello = async function(id) {
    const database = getDatabaseInstance();
    if (!database) {
        console.error('❌ Database non disponibile per prendiPennarello');
        return;
    }

    const user = getCurrentUser();
    const sessionId = `${user.username || 'Studente'}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    const tokenRef = ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}/token`);

    console.log(`🔐 Tentativo lock per ${id} da ${user.username}`);

    const result = await runTransaction(tokenRef, (current) => {
        if (current && current.expiresAt && current.expiresAt > now()) {
            console.log('⛔ Lavagna già occupata');
            return current;
        }
        return {
            userId: user.username || 'Studente',
            username: user.username || 'Studente',
            sessionId,
            acquiredAt: now(),
            expiresAt: now() + LOCK_TIMEOUT_MS
        };
    });

    if (result.committed) {
        localStorage.setItem(sessionKey(id), sessionId);
        console.log('✅ Lock acquisito');
    } else {
        console.log('⛔ Lock fallito (transazione non committata)');
        alert('Lavagna occupata da un altro studente.');
    }
};

window.rilasciaPennarello = async function(id) {
    await releaseLock(id, false);
};

async function releaseLock(id, forced = false) {
    const database = getDatabaseInstance();
    if (!database) return;

    const tokenRef = ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}/token`);
    const board = document.getElementById(`board_${id}`);
    const token = tokenCache[id];

    const user = getCurrentUser();
    const mySession = localStorage.getItem(sessionKey(id));
    const isDocente = user.ruolo === 'docenti';
    const owner = token && (
        token.sessionId === mySession ||
        token.userId === user.username ||
        isDocente
    );

    if (!forced && !owner) return;

    const html = board ? board.innerHTML : '';

    await set(tokenRef, null);

    await update(ref(database, `${BASE_PATH_GLOBAL}/lavagna/${id}`), {
        content: { html, savedAt: now() },
        lastUpdatedAt: now()
    });

    localStorage.removeItem(sessionKey(id));
    console.log('✅ Lock rilasciato');
}

window.forzaLiberaLavagna = async function(id) {
    if (!confirm('Vuoi liberare la lavagna?')) return;
    await releaseLock(id, true);
};