// ================================================================
// MODULO: FORUM
// ================================================================

import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

(function() {
    const css = `
        .forum-container {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid var(--primary-color, #1a6e3a);
        }

        .forum-domanda {
            font-weight: bold;
            font-size: 1.2rem;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 15px;
            text-align: center;
        }

        .forum-input-area {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .forum-input-area input {
            flex: 1;
            min-width: 200px;
            padding: 10px 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            transition: all 0.3s ease;
        }

        .forum-input-area input:focus {
            border-color: var(--primary-color, #1a6e3a);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.1);
        }

        .forum-btn-invia {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1em;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .forum-btn-invia:hover {
            background: #145a30;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 110, 58, 0.3);
        }

        .forum-messaggi {
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        .forum-messaggio {
            padding: 10px 12px;
            margin-bottom: 8px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 8px;
        }

        .forum-messaggio:last-child {
            border-bottom: none;
        }

        .forum-messaggio-main {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;
        }

        .forum-stato {
            font-size: 0.95rem;
            line-height: 1;
            flex: 0 0 auto;
        }

        .forum-stato.attesa { color: #9aa0a6; }
        .forum-stato.approvato { color: #2ecc71; }
        .forum-stato.modifica { color: #f1c40f; }

        .forum-messaggio-testo-blocco {
            min-width: 0;
            flex: 1;
        }

        .forum-messaggio-autore {
            font-weight: bold;
            color: var(--primary-color, #1a6e3a);
            font-size: 0.95rem;
        }

        .forum-messaggio-testo {
            display: block;
            margin-top: 2px;
            word-break: break-word;
            font-size: 0.95rem;
        }

        .forum-feedback {
            margin-top: 6px;
            font-size: 0.9rem;
            padding: 8px 10px;
            border-radius: 8px;
            background: #fff8db;
            color: #7a5b00;
            border: 1px solid #f1d98a;
        }

        .forum-feedback strong {
            display: block;
            margin-bottom: 2px;
        }

        .forum-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .forum-btn-azione {
            border: none;
            border-radius: 8px;
            padding: 8px 10px;
            cursor: pointer;
            font-weight: bold;
            color: white;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .forum-btn-verde { background: #2ecc71; }
        .forum-btn-giallo { background: #f1c40f; color: #2c3e50; }
        .forum-btn-elimina { background: #e74c3c; }

        .forum-btn-azione:hover {
            opacity: 0.92;
        }

        .forum-vuoto {
            color: #999;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        .forum-numero-parole {
            font-size: 0.85em;
            color: #7f8c8d;
            margin-top: 10px;
            text-align: right;
        }

        .forum-riapri {
            margin-top: 10px;
            background: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
            padding: 12px;
        }

        .forum-riapri p {
            margin: 0 0 8px 0;
            font-size: 0.95rem;
        }

        .forum-riapri button {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: bold;
        }

        /* ===== RESPONSIVE FORUM ===== */
        @media (max-width: 600px) {
            .forum-container {
                padding: 12px;
                margin: 15px 0;
            }
            
            .forum-domanda {
                font-size: 1.1rem;
            }
            
            .forum-input-area {
                flex-direction: column;
            }

            .forum-input-area input {
                min-width: 100%;
                font-size: 0.95rem;
            }

            .forum-btn-invia {
                width: 100%;
            }
            
            .forum-messaggio {
                padding: 8px 10px;
            }

            .forum-actions {
                width: 100%;
            }

            .forum-btn-azione {
                flex: 1;
                padding: 6px 8px;
                font-size: 0.8rem;
            }
            
            .forum-messaggi {
                max-height: 300px;
            }
            
            .forum-messaggio-autore {
                font-size: 0.85rem;
            }
            
            .forum-messaggio-testo {
                font-size: 0.85rem;
            }
            
            .forum-stato {
                font-size: 0.85rem;
            }
            
            .forum-feedback {
                font-size: 0.8rem;
            }
            
            .forum-numero-parole {
                font-size: 0.75rem;
            }
        }
        
        @media (max-width: 400px) {
            .forum-container {
                padding: 10px;
            }
            
            .forum-domanda {
                font-size: 1rem;
            }
            
            .forum-messaggi {
                max-height: 250px;
                padding: 8px;
            }
            
            .forum-btn-azione {
                padding: 5px 6px;
                font-size: 0.75rem;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

let dbGlobal = null;
let BASE_PATH_GLOBAL = '';

export function initForum(app) {
    dbGlobal = app;
}

function getUtenteCorrente() {
    const data = localStorage.getItem('parlo_italiano_utente');
    if (!data) return { username: 'Studente', ruolo: 'studenti' };
    try {
        return JSON.parse(data);
    } catch {
        return { username: 'Studente', ruolo: 'studenti' };
    }
}

export function generaForum(config) {
    const data = config?.forum;
    if (!data) return '';

    const id = data.idFirebase || 'forum_generico';
    const domanda = data.domanda || '💬 Scrivi un messaggio';
    const placeholder = data.placeholder || 'Scrivi qui...';

    return `
    <div class="forum-container" id="forum_${id}">
        <div class="forum-domanda">${domanda}</div>

        <div class="forum-input-area">
            <input type="text" id="forum_input_${id}" placeholder="${placeholder}" autocomplete="off">
            <button class="forum-btn-invia" onclick="inviaMessaggioForum('${id}')">📤 Invia</button>
        </div>

        <div class="forum-messaggi" id="forum_messaggi_${id}">
            <div class="forum-vuoto">⏳ Caricamento messaggi...</div>
        </div>

        <div class="forum-numero-parole" id="forum_conteggio_${id}"></div>
    </div>
    `;
}

window.inviaMessaggioForum = function(id) {
    const input = document.getElementById(`forum_input_${id}`);
    if (!input) return;

    const testo = input.value.trim();
    if (!testo) {
        alert("Scrivi qualcosa prima di inviare!");
        return;
    }

    if (!dbGlobal) return;

    const utente = getUtenteCorrente();
    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/forum/${id}/messaggi`;

    const editingId = input.dataset.editingId || '';

    if (editingId) {
        update(ref(database, `${percorso}/${editingId}`), {
            testo,
            stato: 'in_attesa',
            suggerimento: '',
            modifiedAt: Date.now()
        });
        delete input.dataset.editingId;
    } else {
        push(ref(database, percorso), {
            autore: utente.username || 'Studente',
            ruolo: utente.ruolo || 'studenti',
            testo,
            stato: 'in_attesa',
            suggerimento: '',
            timestamp: Date.now(),
            modifiedAt: null
        });
    }

    input.value = '';
};

export function avviaForumListener(basePath, id, isDocente = false) {
    if (!dbGlobal) return;

    BASE_PATH_GLOBAL = basePath;
    const database = getDatabase(dbGlobal);
    const messaggiRef = ref(database, `${BASE_PATH_GLOBAL}/forum/${id}/messaggi`);

    onValue(messaggiRef, (snapshot) => {
        const data = snapshot.val() || {};
        const container = document.getElementById(`forum_messaggi_${id}`);
        const conteggio = document.getElementById(`forum_conteggio_${id}`);
        if (!container) return;

        const utente = getUtenteCorrente();

        const messaggi = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        if (messaggi.length === 0) {
            container.innerHTML = `<div class="forum-vuoto">Ancora nessun messaggio...</div>`;
            if (conteggio) conteggio.textContent = '';
            return;
        }

        let html = '';
        messaggi.forEach((msg) => {
            const isMio = msg.autore === utente.username;
            const stato = msg.stato || 'in_attesa';

            const statoIcon = stato === 'approvato'
                ? '🟢'
                : stato === 'da_modificare'
                    ? '🟡'
                    : '⚪';

            const feedbackHtml = (stato === 'da_modificare' && msg.suggerimento && isMio && utente.ruolo !== 'docenti')
                ? `
                    <div class="forum-feedback">
                        <strong>Suggerimento docente</strong>
                        ${msg.suggerimento}
                        <div class="forum-riapri">
                            <p>Puoi riscrivere la parola e inviarla di nuovo.</p>
                            <button type="button" onclick="riprendiMessaggioForum('${id}', '${msg.id}', '${(msg.testo || '').replace(/'/g, "\\'")}')">Modifica e reinvia</button>
                        </div>
                    </div>
                `
                : (stato === 'da_modificare' && msg.suggerimento ? `
                    <div class="forum-feedback">
                        <strong>Suggerimento docente</strong>
                        ${msg.suggerimento}
                    </div>
                ` : '');

            const actions = isDocente ? `
                <div class="forum-actions">
                    <button class="forum-btn-azione forum-btn-verde" onclick="approvaMessaggioForum('${id}', '${msg.id}')">🟢 Approva</button>
                    <button class="forum-btn-azione forum-btn-giallo" onclick="richiediModificaForum('${id}', '${msg.id}')">🟡 Modifica</button>
                    <button class="forum-btn-azione forum-btn-elimina" onclick="eliminaMessaggioForum('${id}', '${msg.id}')">✖️ Elimina</button>
                </div>
            ` : '';

            html += `
            <div class="forum-messaggio">
                <div class="forum-messaggio-main">
                    <span class="forum-stato ${stato}">${statoIcon}</span>
                    <div class="forum-messaggio-testo-blocco">
                        <span class="forum-messaggio-autore">${msg.autore}:</span>
                        <span class="forum-messaggio-testo">${msg.testo}</span>
                        ${feedbackHtml}
                    </div>
                </div>
                ${actions}
            </div>
            `;
        });

        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;

        if (conteggio) {
            const paroleTotali = messaggi.reduce((acc, msg) => acc + msg.testo.split(/\s+/).filter(Boolean).length, 0);
            conteggio.textContent = `📊 ${messaggi.length} messaggi · ${paroleTotali} parole totali`;
        }
    });
}

window.approvaMessaggioForum = function(id, msgId) {
    if (!dbGlobal) return;
    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/forum/${id}/messaggi/${msgId}`;
    update(ref(database, percorso), {
        stato: 'approvato',
        suggerimento: ''
    });
};

window.richiediModificaForum = function(id, msgId) {
    if (!dbGlobal) return;

    const suggerimento = prompt('Inserisci un suggerimento per lo studente:');
    if (suggerimento === null) return;

    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/forum/${id}/messaggi/${msgId}`;
    update(ref(database, percorso), {
        stato: 'da_modificare',
        suggerimento: suggerimento.trim()
    });
};

window.riprendiMessaggioForum = function(id, msgId, testo) {
    const input = document.getElementById(`forum_input_${id}`);
    if (!input) return;
    input.value = testo || '';
    input.dataset.editingId = msgId;
    input.focus();
};

window.eliminaMessaggioForum = function(id, msgId) {
    if (!confirm('⚠️ Cancellare questo messaggio?')) return;
    if (!dbGlobal) return;

    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/forum/${id}/messaggi/${msgId}`;

    remove(ref(database, percorso)).catch((error) => {
        console.error('❌ Errore durante l\'eliminazione:', error);
        alert('❌ Errore durante l\'eliminazione.');
    });
};
