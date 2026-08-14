import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziCorrenti = [];
let isDocenteCorrente = false;
let myUserNameCorrente = '';
let modalitaCorrente = 'scrittura';

function iniettaCss() {
    if (document.getElementById('parliamone-insieme-css')) return;
    const style = document.createElement('style');
    style.id = 'parliamone-insieme-css';
    style.textContent = `
        .parliamone-container { margin: 16px 0; }
        .parliamone-container h3 {
            text-align: center;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        .parliamone-regia {
            background: #e8f4f8;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            border: 2px solid #3498db;
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .parliamone-regia strong {
            color: #2c3e50;
            margin-right: 8px;
        }
        .parliamone-regia .btn-scrittura,
        .parliamone-regia .btn-orale {
            padding: 8px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }
        .parliamone-regia .btn-scrittura {
            background: #3498db;
            color: white;
        }
        .parliamone-regia .btn-orale {
            background: #e74c3c;
            color: white;
        }
        .parliamone-regia .btn-scrittura:hover,
        .parliamone-regia .btn-orale:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }
        .parliamone-regia .btn-scrittura.attiva {
            background: #1a6e3a;
            box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.3);
        }
        .parliamone-regia .btn-orale.attiva {
            background: #c0392b;
            box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.3);
        }
        .parliamone-regia .modalita-label {
            font-size: 0.85rem;
            color: #555;
            background: white;
            padding: 4px 14px;
            border-radius: 20px;
            border: 1px solid #ddd;
        }
        .parliamone-card {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .parliamone-card .domanda {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 12px;
        }
        .parliamone-studente {
            display: block;
        }
        .parliamone-form {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .parliamone-form input {
            flex: 1;
            min-width: 200px;
            padding: 10px 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        .parliamone-form input:focus {
            border-color: var(--primary-color, #1a6e3a);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.1);
        }
        .parliamone-form button {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        .parliamone-form button:hover {
            background: #145a30;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 110, 58, 0.3);
        }
        .parliamone-mia-risposta {
            margin-top: 10px;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            background: #fff;
        }
        .parliamone-stato {
            font-size: 0.9rem;
            margin-top: 6px;
        }
        .parliamone-stato.approvata { color: #168a2f; }
        .parliamone-stato.in_attesa { color: #8a6d3b; }
        .parliamone-stato.da_modificare { color: #b26a00; }
        .parliamone-suggerimento {
            margin-top: 8px;
            padding: 8px 12px;
            background: #fff7e6;
            border-left: 4px solid #f0ad4e;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        .parliamone-riapri {
            margin-top: 8px;
        }
        .parliamone-riapri button {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 14px;
            cursor: pointer;
            font-weight: 600;
        }
        .parliamone-riapri button:hover {
            background: #145a30;
        }
        .parliamone-docente-panel {
            margin-top: 12px;
            padding: 12px 16px;
            background: #fff8e1;
            border-radius: 8px;
            border: 1px solid #f1c40f;
        }
        .parliamone-docente-panel .titolo {
            font-weight: 700;
            color: #6b5300;
            margin-bottom: 8px;
        }
        .parliamone-risposta-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            gap: 10px;
            flex-wrap: wrap;
            border-bottom: 1px solid #f0e8d0;
        }
        .parliamone-risposta-item:last-child {
            border-bottom: none;
        }
        .parliamone-risposta-item .studente {
            font-weight: 600;
        }
        .parliamone-risposta-item .testo-risposta {
            color: #333;
        }
        .parliamone-azioni {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .parliamone-azioni button {
            border: none;
            border-radius: 6px;
            padding: 4px 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s ease;
        }
        .parliamone-azioni button:hover {
            transform: scale(1.05);
        }
        .btn-approva { background: #168a2f; color: #fff; }
        .btn-modifica { background: #f0ad4e; color: #fff; }
        .btn-elimina { background: #e74c3c; color: #fff; }
        .parliamone-vuoto {
            color: #999;
            font-style: italic;
            padding: 4px 0;
        }
        @media (max-width: 600px) {
            .parliamone-regia {
                flex-direction: column;
                padding: 12px;
            }
            .parliamone-form {
                flex-direction: column;
            }
            .parliamone-form input {
                min-width: 100%;
            }
            .parliamone-form button {
                width: 100%;
            }
            .parliamone-risposta-item {
                flex-direction: column;
                align-items: stretch;
            }
        }
    `;
    document.head.appendChild(style);
}

export function generaParliamoneInsieme(dati, isDocente = false) {
    iniettaCss();
    if (!dati?.esercizi?.length) return '';

    return `
        <div class="parliamone-container">
            <h3>${dati.titolo || '💬 Parliamone insieme'}</h3>
            <p class="scheda-istruzioni">${dati.istruzioni || ''}</p>

            ${isDocente ? `
                <div class="parliamone-regia" id="regia-parliamone">
                    <strong>🎛️ Regia Docente</strong>
                    <button class="btn-scrittura attiva" onclick="window.impostaModalitaParliamone('scrittura')">✍️ Modalità Scrittura</button>
                    <button class="btn-orale" onclick="window.impostaModalitaParliamone('orale')">🗣️ Modalità Orale</button>
                    <span class="modalita-label" id="modalita-label-parliamone">📝 Scrittura</span>
                </div>
            ` : ''}

            ${dati.esercizi.map(esercizio => `
                <div class="parliamone-card" id="card_${esercizio.id}">
                    <div class="domanda">${esercizio.domanda}</div>

                    <div class="parliamone-studente" id="studente_${esercizio.id}">
                        <div class="parliamone-form" id="form_${esercizio.id}" ${isDocente ? 'style="display:none;"' : ''}>
                            <input type="text" id="input_parliamone_${esercizio.id}" placeholder="Scrivi qui la tua risposta..." />
                            <button onclick="window.inviaRispostaParliamone('${esercizio.id}')">Invia</button>
                        </div>

                        <div class="parliamone-mia-risposta" id="risposta_${esercizio.id}"></div>
                        <div class="parliamone-stato" id="stato_${esercizio.id}"></div>
                        <div class="parliamone-suggerimento" id="suggerimento_${esercizio.id}"></div>

                        <div id="riapri_${esercizio.id}" style="display:none; margin-top:8px;">
                            <button onclick="window.riapriInputParliamone('${esercizio.id}')" style="background:var(--primary-color);color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;">
                                ✏️ Modifica la risposta
                            </button>
                        </div>
                    </div>

                    ${isDocente ? `
                        <div class="parliamone-docente-panel" id="docente_${esercizio.id}">
                            <div class="titolo">👨‍🏫 Pannello Docente</div>
                            <div id="docente_lista_${esercizio.id}">
                                <div class="parliamone-vuoto">In attesa delle risposte degli studenti...</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

export function initParliamoneInsieme(app) {
    db = getDatabase(app);
    console.log('📦 parliamoneInsieme: inizializzato');
}

export function avviaParliamoneInsiemeListener(basePath, esercizi, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ parliamoneInsieme: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    eserciziCorrenti = esercizi || [];
    isDocenteCorrente = isDocente;
    myUserNameCorrente = username;

    eserciziCorrenti.forEach(esercizio => {
        const risposteRef = ref(db, `${basePath}/parliamoneInsieme/${esercizio.id}/risposte`);
        onValue(risposteRef, (snap) => {
            aggiornaUIEsercizio(esercizio.id, snap.val() || {});
        });
    });

    const modalitaRef = ref(db, `${basePath}/system/modalita_parliamoneInsieme`);
    onValue(modalitaRef, (snap) => {
        modalitaCorrente = snap.val() || 'scrittura';
        aggiornaModalitaUI();
        eserciziCorrenti.forEach(esercizio => {
            aggiornaUIEsercizio(esercizio.id, null, true);
        });
    });
}

function aggiornaModalitaUI() {
    const btnScrittura = document.querySelector('.btn-scrittura');
    const btnOrale = document.querySelector('.btn-orale');
    const label = document.getElementById('modalita-label-parliamone');

    if (btnScrittura) btnScrittura.classList.toggle('attiva', modalitaCorrente === 'scrittura');
    if (btnOrale) btnOrale.classList.toggle('attiva', modalitaCorrente === 'orale');
    if (label) label.textContent = modalitaCorrente === 'scrittura' ? '📝 Scrittura' : '🎤 Orale';
}

function aggiornaUIEsercizio(idEsercizio, dati, soloModalita = false) {
    const esercizio = eserciziCorrenti.find(e => e.id === idEsercizio);
    if (!esercizio) return;

    const studenteEl = document.getElementById(`studente_${idEsercizio}`);
    const statoEl = document.getElementById(`stato_${idEsercizio}`);
    const testoEl = document.getElementById(`risposta_${idEsercizio}`);
    const suggEl = document.getElementById(`suggerimento_${idEsercizio}`);
    const riapriEl = document.getElementById(`riapri_${idEsercizio}`);
    const formEl = document.getElementById(`form_${idEsercizio}`);
    const docenteLista = document.getElementById(`docente_lista_${idEsercizio}`);

    const isOrale = modalitaCorrente === 'orale';

    if (studenteEl) {
        studenteEl.style.display = isOrale ? 'none' : 'block';
    }

    if (soloModalita) return;
    if (!dati) return;

    const miaRisposta = dati[myUserNameCorrente] || null;

    if (statoEl && testoEl && suggEl) {
        if (miaRisposta) {
            testoEl.textContent = `📝 La tua risposta: "${miaRisposta.testo || ''}"`;

            const stato = miaRisposta.stato || 'in_attesa';
            statoEl.textContent =
                stato === 'approvata' ? '✅ Approvata!' :
                stato === 'da_modificare' ? '✏️ Da modificare' :
                '⏳ In attesa di correzione...';
            statoEl.className = `parliamone-stato ${stato}`;

            if (miaRisposta.suggerimento) {
                suggEl.textContent = `💡 ${miaRisposta.suggerimento}`;
                suggEl.style.display = 'block';
            } else {
                suggEl.textContent = '';
                suggEl.style.display = 'none';
            }

            if (stato === 'da_modificare' && !isOrale) {
                if (formEl) formEl.style.display = 'flex';
                if (riapriEl) riapriEl.style.display = 'none';
                const input = document.getElementById(`input_parliamone_${idEsercizio}`);
                if (input) input.value = miaRisposta.testo || '';
            } else {
                if (formEl && !isOrale && !isDocenteCorrente) formEl.style.display = 'none';
                if (riapriEl) riapriEl.style.display = 'none';
            }
        } else {
            testoEl.textContent = '';
            statoEl.textContent = 'Scrivi una risposta...';
            statoEl.className = 'parliamone-stato';
            suggEl.textContent = '';
            suggEl.style.display = 'none';
            if (formEl && !isOrale && !isDocenteCorrente) formEl.style.display = 'flex';
            if (riapriEl) riapriEl.style.display = 'none';
        }
    }

    if (docenteLista && isDocenteCorrente) {
        const studenti = Object.keys(dati);
        if (studenti.length === 0) {
            docenteLista.innerHTML = '<div class="parliamone-vuoto">In attesa delle risposte degli studenti...</div>';
            return;
        }

        let html = '';
        studenti.forEach(nome => {
            const risposta = dati[nome];
            const stato = risposta?.stato || 'in_attesa';
            const icona = stato === 'approvata' ? '🟢' : stato === 'da_modificare' ? '🟡' : '⏳';

            html += `
                <div class="parliamone-risposta-item">
                    <div>
                        <span class="studente">${nome}:</span>
                        <span class="testo-risposta">${risposta?.testo || ''}</span>
                        <span style="font-size:0.9rem; margin-left:6px;">${icona}</span>
                        ${risposta?.suggerimento ? `<div style="font-size:0.85rem;color:#b26a00;">💡 ${risposta.suggerimento}</div>` : ''}
                    </div>
                    <div class="parliamone-azioni">
                        <button class="btn-approva" onclick="window.approvaRispostaParliamone('${idEsercizio}','${nome}')">Approva</button>
                        <button class="btn-modifica" onclick="window.richiediModificaRispostaParliamone('${idEsercizio}','${nome}')">Modifica</button>
                        <button class="btn-elimina" onclick="window.eliminaRispostaParliamone('${idEsercizio}','${nome}')">✖</button>
                    </div>
                </div>
            `;
        });
        docenteLista.innerHTML = html;
    }
}

window.inviaRispostaParliamone = async function(idEsercizio) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    if (modalitaCorrente === 'orale') {
        alert('📢 Modalità Orale attiva! Rispondi a voce, non per iscritto.');
        return;
    }

    const input = document.getElementById(`input_parliamone_${idEsercizio}`);
    if (!input) return;

    const testo = input.value.trim();
    if (!testo) {
        alert('Scrivi una risposta!');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/parliamoneInsieme/${idEsercizio}/risposte/${myUserNameCorrente}`);
    await set(refRisposta, {
        testo: testo,
        stato: 'in_attesa',
        suggerimento: '',
        timestamp: Date.now()
    });

    input.value = '';
};

window.riapriInputParliamone = function(idEsercizio) {
    if (modalitaCorrente === 'orale') return;
    const form = document.getElementById(`form_${idEsercizio}`);
    if (form) form.style.display = 'flex';
    const input = document.getElementById(`input_parliamone_${idEsercizio}`);
    if (input) input.focus();
};

window.approvaRispostaParliamone = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;
    const refRisposta = ref(db, `${basePathCorrente}/parliamoneInsieme/${idEsercizio}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'approvata',
        suggerimento: '',
        timestamp: Date.now()
    });
};

window.richiediModificaRispostaParliamone = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;

    const suggerimento = prompt('✏️ Scrivi un suggerimento per lo studente:');
    if (suggerimento === null) return;
    if (suggerimento.trim() === '') {
        alert('Il suggerimento non può essere vuoto.');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/parliamoneInsieme/${idEsercizio}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'da_modificare',
        suggerimento: suggerimento.trim(),
        timestamp: Date.now()
    });
};

window.eliminaRispostaParliamone = async function(idEsercizio, studentName) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Eliminare la risposta di ${studentName}?`)) return;

    const refRisposta = ref(db, `${basePathCorrente}/parliamoneInsieme/${idEsercizio}/risposte/${studentName}`);
    await remove(refRisposta);
};

window.resettaRisposteParliamone = async function(idEsercizio) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Resettare tutte le risposte per questo esercizio?`)) return;

    const refEsercizio = ref(db, `${basePathCorrente}/parliamoneInsieme/${idEsercizio}`);
    await remove(refEsercizio);
};

window.impostaModalitaParliamone = async function(modalita) {
    if (!db || !isDocenteCorrente) return;
    if (modalita !== 'scrittura' && modalita !== 'orale') return;

    const modalitaRef = ref(db, `${basePathCorrente}/system/modalita_parliamoneInsieme`);
    await set(modalitaRef, modalita);
};
