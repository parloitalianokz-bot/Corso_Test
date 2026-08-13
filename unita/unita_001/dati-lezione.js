import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziCorrenti = [];
let isDocenteCorrente = false;
let myUserNameCorrente = '';

function iniettaCss() {
    if (document.getElementById('crea-domande-css')) return;
    const style = document.createElement('style');
    style.id = 'crea-domande-css';
    style.textContent = `
        .scheda-crea-domande { margin: 16px 0; }
        .scheda-crea-domande h3 {
            text-align: center;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        .crea-domanda-card {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .crea-domanda-risposta {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--primary-color, #1a6e3a);
        }
        .crea-domanda-guida {
            color: #666;
            font-size: 0.95rem;
            margin-bottom: 12px;
            font-style: italic;
        }
        .crea-domanda-form {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .crea-domanda-form input {
            flex: 1;
            min-width: 200px;
            padding: 10px 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        .crea-domanda-form input:focus {
            border-color: var(--primary-color, #1a6e3a);
            outline: none;
        }
        .crea-domanda-form button {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
        }
        .crea-domanda-form button:hover { background: #145a30; }
        .crea-domanda-risposta-studente {
            margin-top: 10px;
            font-weight: 500;
        }
        .crea-domanda-stato {
            font-size: 0.9rem;
            margin-top: 4px;
        }
        .crea-domanda-stato.approvata { color: #168a2f; }
        .crea-domanda-stato.in_attesa { color: #8a6d3b; }
        .crea-domanda-stato.da_modificare { color: #b26a00; }
        .crea-domanda-suggerimento {
            margin-top: 8px;
            padding: 8px 12px;
            background: #fff7e6;
            border-left: 4px solid #f0ad4e;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        .pannello-docente {
            margin-top: 12px;
            padding: 12px 16px;
            background: #fff8e1;
            border-radius: 8px;
            border: 1px solid #f1c40f;
        }
        .pannello-docente strong {
            display: block;
            margin-bottom: 8px;
            color: #6b5300;
        }
        .docente-riga {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }
        .docente-riga input {
            flex: 1;
            min-width: 150px;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.9rem;
        }
        .docente-riga button {
            border: none;
            border-radius: 6px;
            padding: 6px 14px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-approva { background: #168a2f; color: #fff; }
        .btn-modifica { background: #f0ad4e; color: #fff; }
        .btn-elimina { background: #e74c3c; color: #fff; }
        .crea-domanda-risposte-lista {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #f0e8d0;
        }
        .crea-domanda-risposta-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            gap: 10px;
            flex-wrap: wrap;
        }
        .crea-domanda-risposta-item .studente { font-weight: 600; }
        @media (max-width: 600px) {
            .crea-domanda-form { flex-direction: column; }
            .crea-domanda-form input { min-width: 100%; }
            .docente-riga { flex-direction: column; }
        }
    `;
    document.head.appendChild(style);
}

export function initCreaDomande(app) {
    db = getDatabase(app);
    console.log('📦 creaDomande: inizializzato');
}

export function generaCreaDomande(dati, isDocente = false) {
    iniettaCss();
    if (!dati?.esercizi?.length) return '';

    return `
        <div class="scheda-crea-domande">
            <h3>${dati.titolo || '🎤 Creiamo le domande'}</h3>
            <p class="scheda-istruzioni">${dati.istruzioni || ''}</p>
            ${dati.esercizi.map(esercizio => `
                <div class="crea-domanda-card" id="card_${esercizio.id}">
                    <div class="crea-domanda-risposta">
                        <strong>Risposta:</strong> ${esercizio.risposta}
                    </div>
                    <div class="crea-domanda-guida">${esercizio.guida || ''}</div>

                    <div class="crea-domanda-form" id="form_${esercizio.id}" ${isDocente ? 'style="display:none;"' : ''}>
                        <input type="text" id="input_${esercizio.id}" placeholder="Scrivi qui la tua domanda..." />
                        <button onclick="window.inviaCreaDomanda('${esercizio.id}')">Invia</button>
                    </div>

                    <div class="crea-domanda-risposta-studente" id="testo_${esercizio.id}"></div>
                    <div class="crea-domanda-stato" id="stato_${esercizio.id}"></div>
                    <div class="crea-domanda-suggerimento" id="suggerimento_${esercizio.id}"></div>

                    <div id="riapri_${esercizio.id}" style="display:none; margin-top:8px;">
                        <button onclick="window.riapriInputCreaDomanda('${esercizio.id}')" style="background:var(--primary-color);color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;">✏️ Modifica la risposta</button>
                    </div>

                    ${isDocente ? `
                        <div class="pannello-docente" id="docente_${esercizio.id}">
                            <strong>👨‍🏫 Pannello Docente</strong>
                            <div id="docente_lista_${esercizio.id}" class="crea-domanda-risposte-lista">
                                <em style="color:#999;">In attesa delle risposte degli studenti...</em>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

export function avviaCreaDomandeListener(basePath, esercizi, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ creaDomande: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    eserciziCorrenti = esercizi || [];
    isDocenteCorrente = isDocente;
    myUserNameCorrente = username;

    eserciziCorrenti.forEach(esercizio => {
        const risposteRef = ref(db, `${basePath}/creaDomande/${esercizio.id}/risposte`);
        onValue(risposteRef, (snap) => {
            aggiornaUI(esercizio.id, snap.val() || {});
        });
    });
}

function aggiornaUI(idEsercizio, dati) {
    const statoEl = document.getElementById(`stato_${idEsercizio}`);
    const testoEl = document.getElementById(`testo_${idEsercizio}`);
    const suggEl = document.getElementById(`suggerimento_${idEsercizio}`);
    const riapriEl = document.getElementById(`riapri_${idEsercizio}`);
    const formEl = document.getElementById(`form_${idEsercizio}`);
    const docenteLista = document.getElementById(`docente_lista_${idEsercizio}`);

    const miaRisposta = dati[myUserNameCorrente] || null;

    if (testoEl && statoEl && suggEl) {
        if (miaRisposta) {
            testoEl.textContent = `📝 La tua risposta: "${miaRisposta.domanda || ''}"`;
            const stato = miaRisposta.stato || 'in_attesa';
            statoEl.textContent = stato === 'approvata'
                ? '✅ Approvata!'
                : stato === 'da_modificare'
                    ? '✏️ Da modificare'
                    : '⏳ In attesa di correzione...';
            statoEl.className = `crea-domanda-stato ${stato}`;

            if (miaRisposta.suggerimento) {
                suggEl.textContent = `💡 ${miaRisposta.suggerimento}`;
                suggEl.style.display = 'block';
            } else {
                suggEl.textContent = '';
                suggEl.style.display = 'none';
            }

            if (stato === 'da_modificare') {
                if (formEl) formEl.style.display = 'flex';
                if (riapriEl) riapriEl.style.display = 'none';
                const input = document.getElementById(`input_${idEsercizio}`);
                if (input) input.value = miaRisposta.domanda || '';
            } else {
                if (formEl) formEl.style.display = 'none';
                if (riapriEl) riapriEl.style.display = 'none';
            }
        } else {
            testoEl.textContent = '';
            statoEl.textContent = 'Scegli una domanda...';
            statoEl.className = 'crea-domanda-stato';
            suggEl.textContent = '';
            suggEl.style.display = 'none';
            if (formEl) formEl.style.display = 'flex';
            if (riapriEl) riapriEl.style.display = 'none';
        }
    }

    if (docenteLista && isDocenteCorrente) {
        const studenti = Object.keys(dati);
        if (studenti.length === 0) {
            docenteLista.innerHTML = '<em style="color:#999;">In attesa delle risposte degli studenti...</em>';
            return;
        }

        let html = '';
        studenti.forEach(nome => {
            const risposta = dati[nome];
            const stato = risposta?.stato || 'in_attesa';
            const icona = stato === 'approvata' ? '🟢' : stato === 'da_modificare' ? '🟡' : '⏳';

            html += `
                <div class="crea-domanda-risposta-item">
                    <div>
                        <span class="studente">${nome}:</span>
                        <span>${risposta?.domanda || ''}</span>
                        <span style="font-size:0.9rem;">${icona}</span>
                        ${risposta?.suggerimento ? `<div style="font-size:0.85rem;color:#b26a00;">💡 ${risposta.suggerimento}</div>` : ''}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button class="btn-approva" onclick="window.approvaCreaDomanda('${idEsercizio}','${nome}')">Approva</button>
                        <button class="btn-modifica" onclick="window.richiediModificaCreaDomanda('${idEsercizio}','${nome}')">Modifica</button>
                        <button class="btn-elimina" onclick="window.eliminaCreaDomanda('${idEsercizio}','${nome}')">✖</button>
                    </div>
                </div>
            `;
        });
        docenteLista.innerHTML = html;
    }
}

window.inviaCreaDomanda = async function(idEsercizio) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const input = document.getElementById(`input_${idEsercizio}`);
    if (!input) return;

    const testo = input.value.trim();
    if (!testo) {
        alert('Scrivi una domanda!');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/creaDomande/${idEsercizio}/risposte/${myUserNameCorrente}`);
    await set(refRisposta, {
        domanda: testo,
        stato: 'in_attesa',
        suggerimento: '',
        timestamp: Date.now()
    });

    input.value = '';
};

window.riapriInputCreaDomanda = function(idEsercizio) {
    const form = document.getElementById(`form_${idEsercizio}`);
    if (form) form.style.display = 'flex';
    const input = document.getElementById(`input_${idEsercizio}`);
    if (input) input.focus();
};

window.approvaCreaDomanda = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;
    const refRisposta = ref(db, `${basePathCorrente}/creaDomande/${idEsercizio}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'approvata',
        suggerimento: '',
        timestamp: Date.now()
    });
};

window.richiediModificaCreaDomanda = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;

    // ✅ CHIEDE AL DOCENTE DI SCRIVERE IL SUGGERIMENTO
    const suggerimento = prompt('✏️ Scrivi un suggerimento per lo studente:');
    if (suggerimento === null) return;  // Annulla
    if (suggerimento.trim() === '') {
        alert('Il suggerimento non può essere vuoto.');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/creaDomande/${idEsercizio}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'da_modificare',
        suggerimento: suggerimento.trim(),
        timestamp: Date.now()
    });
};

window.eliminaCreaDomanda = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Eliminare la risposta di ${studentName}?`)) return;

    const refRisposta = ref(db, `${basePathCorrente}/creaDomande/${idEsercizio}/risposte/${studentName}`);
    await remove(refRisposta);
};

window.resettaCreaDomanda = async function(idEsercizio) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Resettare tutte le risposte per questo esercizio?`)) return;

    const refEsercizio = ref(db, `${basePathCorrente}/creaDomande/${idEsercizio}`);
    await remove(refEsercizio);
};
