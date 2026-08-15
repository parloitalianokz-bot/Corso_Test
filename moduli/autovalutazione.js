// ================================================================
// MODULO: AUTOVALUTAZIONE (Scheda 12)
// ================================================================

import { getDatabase, ref, set, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let myUserNameCorrente = '';
let obiettiviCorrenti = [];
let isDocenteCorrente = false;

function iniettaCss() {
    if (document.getElementById('autovalutazione-css')) return;
    const style = document.createElement('style');
    style.id = 'autovalutazione-css';
    style.textContent = `
        .autovalutazione-container { margin: 16px 0; }
        .autovalutazione-container h3 {
            text-align: center;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.3rem;
            margin-bottom: 8px;
        }

        .autovalutazione-box {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .autovalutazione-box .obiettivo {
            font-weight: 600;
            font-size: 1.05rem;
            margin-bottom: 10px;
            color: var(--text-color, #1a1a2e);
        }

        .autovalutazione-livelli {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .autovalutazione-livelli button {
            flex: 1;
            min-width: 80px;
            padding: 10px 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            background: white;
        }

        .autovalutazione-livelli button:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .autovalutazione-livelli button.selezionato-verde {
            border-color: #27ae60;
            background: #d4edda;
            color: #155724;
        }

        .autovalutazione-livelli button.selezionato-giallo {
            border-color: #f1c40f;
            background: #fff3cd;
            color: #856404;
        }

        .autovalutazione-livelli button.selezionato-rosso {
            border-color: #e74c3c;
            background: #f8d7da;
            color: #721c24;
        }

        .autovalutazione-livelli button .icona { margin-right: 6px; }

        .autovalutazione-feedback {
            margin-top: 20px;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            display: none;
            border: 2px solid transparent;
        }

        .autovalutazione-feedback.visibile { display: block; }
        .autovalutazione-feedback .emoji { font-size: 2.5rem; display: block; margin-bottom: 8px; }
        .autovalutazione-feedback .titolo { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
        .autovalutazione-feedback .messaggio { font-size: 1rem; }
        .autovalutazione-feedback .dettaglio { font-size: 0.9rem; color: #555; margin-top: 8px; }

        .autovalutazione-feedback.verde { background: #d4edda; border-color: #27ae60; color: #155724; }
        .autovalutazione-feedback.giallo { background: #fff3cd; border-color: #f1c40f; color: #856404; }
        .autovalutazione-feedback.rosso { background: #f8d7da; border-color: #e74c3c; color: #721c24; }
        .autovalutazione-feedback.misto { background: #e8f4f8; border-color: #3498db; color: #2c3e50; }

        .autovalutazione-progresso {
            margin-top: 12px;
            text-align: center;
            font-size: 0.95rem;
            color: #7f8c8d;
        }

        .autovalutazione-reset {
            margin-top: 10px;
            text-align: center;
        }

        .autovalutazione-reset button {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 16px;
            cursor: pointer;
            font-weight: 600;
        }

        .autovalutazione-reset button:hover { background: #c0392b; }

        .autovalutazione-ripasso-box {
            margin-top: 12px;
            padding: 12px 16px;
            background: rgba(255,255,255,0.5);
            border-radius: 8px;
            text-align: left;
        }

        .autovalutazione-ripasso-box ul {
            margin: 6px 0 0 20px;
            padding: 0;
        }

        .autovalutazione-ripasso-box li { margin-bottom: 4px; }

        .autovalutazione-docente-panel {
            margin-top: 18px;
            padding: 16px;
            background: #f9fbfd;
            border: 1px solid #dde7ef;
            border-radius: 12px;
            overflow-x: auto;
        }

        .autovalutazione-docente-panel h4 {
            margin: 0 0 12px 0;
            color: var(--primary-color, #1a6e3a);
            text-align: center;
        }

        .autovalutazione-tabella {
            width: 100%;
            border-collapse: collapse;
            min-width: 700px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
        }

        .autovalutazione-tabella th,
        .autovalutazione-tabella td {
            border: 1px solid #e6edf2;
            padding: 10px 12px;
            text-align: center;
            vertical-align: middle;
            font-size: 0.95rem;
        }

        .autovalutazione-tabella th {
            background: #eef6f2;
            color: #1a6e3a;
            font-weight: 700;
        }

        .autovalutazione-tabella td:first-child,
        .autovalutazione-tabella th:first-child {
            text-align: left;
            font-weight: 700;
            min-width: 180px;
        }

        .autovalutazione-cella-verde { background: #d4edda; color: #155724; }
        .autovalutazione-cella-gialla { background: #fff3cd; color: #856404; }
        .autovalutazione-cella-rossa { background: #f8d7da; color: #721c24; }
        .autovalutazione-cella-vuota { color: #999; background: #fafafa; }

        .autovalutazione-riga-azioni button {
            margin-top: 8px;
            padding: 6px 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background: #e74c3c;
            color: white;
            font-weight: 600;
        }

        @media (max-width: 600px) {
            .autovalutazione-livelli { flex-direction: column; }
            .autovalutazione-livelli button { min-width: 100%; }
            .autovalutazione-feedback .emoji { font-size: 2rem; }
        }
    `;
    document.head.appendChild(style);
}

export function generaAutovalutazione(dati, isDocente = false) {
    iniettaCss();
    if (!dati?.obiettivi?.length) return '';

    if (isDocente) {
        return `
            <div class="autovalutazione-container">
                <h3>${dati.titolo || '✅ Autovalutazione'}</h3>
                <p class="scheda-istruzioni">${dati.istruzioni || ''}</p>
                <div class="autovalutazione-docente-panel" id="auto_docente_panel">
                    <h4>📊 Risultati degli studenti</h4>
                    <div id="auto_docente_lista">Caricamento risultati...</div>
                </div>
                <div class="autovalutazione-reset">
                    <button onclick="window.resettaTutteAutovalutazioni()">🔄 Reset tutte le autovalutazioni</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="autovalutazione-container">
            <h3>${dati.titolo || '✅ Autovalutazione'}</h3>
            <p class="scheda-istruzioni">${dati.istruzioni || ''}</p>

            ${dati.obiettivi.map((obj, idx) => `
                <div class="autovalutazione-box" id="auto_${obj.id}">
                    <div class="obiettivo">${idx + 1}. ${obj.testo}</div>
                    <div class="autovalutazione-livelli">
                        <button onclick="window.inviaAutovalutazione('${obj.id}', 'verde')">
                            <span class="icona">🟢</span> Sì
                        </button>
                        <button onclick="window.inviaAutovalutazione('${obj.id}', 'giallo')">
                            <span class="icona">🟡</span> Sì, ma non sono sicuro
                        </button>
                        <button onclick="window.inviaAutovalutazione('${obj.id}', 'rosso')">
                            <span class="icona">🔴</span> No
                        </button>
                    </div>
                </div>
            `).join('')}

            <div class="autovalutazione-progresso" id="auto_progresso">
                📝 0 su ${dati.obiettivi.length} obiettivi valutati.
            </div>

            <div class="autovalutazione-feedback" id="auto_feedback"></div>
        </div>
    `;
}

export function initAutovalutazione(app) {
    db = getDatabase(app);
}

export function avviaAutovalutazioneListener(basePath, obiettivi, isDocente = false, username = '') {
    if (!db) return;

    basePathCorrente = basePath;
    myUserNameCorrente = username;
    obiettiviCorrenti = obiettivi || [];
    isDocenteCorrente = isDocente;

    if (isDocente) {
        const rootRef = ref(db, `${basePath}/autovalutazione`);
        onValue(rootRef, (snap) => {
            aggiornaPannelloDocente(snap.val() || {});
        });
        return;
    }

    const autoRef = ref(db, `${basePath}/autovalutazione/${username}`);
    onValue(autoRef, (snap) => {
        aggiornaUIAutovalutazione(obiettivi, snap.val() || {});
    });
}

function aggiornaUIAutovalutazione(obiettivi, dati) {
    const progressoEl = document.getElementById('auto_progresso');
    const feedbackEl = document.getElementById('auto_feedback');
    if (!progressoEl || !feedbackEl) return;

    const risposte = {};
    let conteggio = 0;
    const totali = obiettivi.length;

    obiettivi.forEach(obj => {
        const stato = dati[obj.id]?.stato || null;
        risposte[obj.id] = stato;
        if (stato) conteggio++;

        const box = document.getElementById(`auto_${obj.id}`);
        if (box) {
            const buttons = box.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.className = '';
                if (btn.onclick?.toString().includes("'verde'")) {
                    if (stato === 'verde') btn.classList.add('selezionato-verde');
                } else if (btn.onclick?.toString().includes("'giallo'")) {
                    if (stato === 'giallo') btn.classList.add('selezionato-giallo');
                } else if (btn.onclick?.toString().includes("'rosso'")) {
                    if (stato === 'rosso') btn.classList.add('selezionato-rosso');
                }
            });
        }
    });

    progressoEl.textContent = `📝 ${conteggio} su ${totali} obiettivi valutati.`;

    if (conteggio === totali) {
        const feedback = generaFeedback(risposte);
        feedbackEl.className = `autovalutazione-feedback visibile ${feedback.colore}`;
        feedbackEl.innerHTML = `
            <span class="emoji">${feedback.emoji}</span>
            <div class="titolo">${feedback.titolo}</div>
            <div class="messaggio">${feedback.messaggio}</div>
            ${feedback.dettaglio ? `<div class="dettaglio">${feedback.dettaglio}</div>` : ''}
            ${feedback.ripasso ? `<div class="autovalutazione-ripasso-box">${feedback.ripasso}</div>` : ''}
        `;
    } else {
        feedbackEl.className = 'autovalutazione-feedback';
        feedbackEl.innerHTML = '<p style="color:#7f8c8d; font-style:italic;">Completa l\'autovalutazione per ricevere un feedback personalizzato!</p>';
    }
}

function aggiornaPannelloDocente(datiTuttiStudenti) {
    const lista = document.getElementById('auto_docente_lista');
    if (!lista) return;

    const studenti = Object.keys(datiTuttiStudenti);
    if (!studenti.length) {
        lista.innerHTML = '<p style="margin:0;color:#666;">Nessuna autovalutazione ancora presente.</p>';
        return;
    }

    const obiettivi = obiettiviCorrenti || [];

    let html = `<table class="autovalutazione-tabella">
        <thead>
            <tr>
                <th>Studente</th>
                ${obiettivi.map(o => `<th>${o.testoDocente || o.testo}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;

    studenti.forEach(studentName => {
        const valutazioni = datiTuttiStudenti[studentName] || {};
        html += `<tr>
            <td>
                👤 ${studentName}
                <div class="autovalutazione-riga-azioni">
                    <button onclick="window.resettaAutovalutazione('${studentName}')">Reset</button>
                </div>
            </td>`;

        obiettivi.forEach(obj => {
            const stato = valutazioni[obj.id]?.stato || '';
            let classe = 'autovalutazione-cella-vuota';
            let simbolo = '—';

            if (stato === 'verde') {
                classe = 'autovalutazione-cella-verde';
                simbolo = '🟢';
            } else if (stato === 'giallo') {
                classe = 'autovalutazione-cella-gialla';
                simbolo = '🟡';
            } else if (stato === 'rosso') {
                classe = 'autovalutazione-cella-rossa';
                simbolo = '🔴';
            }

            html += `<td class="${classe}">${simbolo}</td>`;
        });

        html += `</tr>`;
    });

    html += `</tbody></table>`;
    lista.innerHTML = html;
}

function generaFeedback(risposte) {
    const valori = Object.values(risposte);
    const conteggioVerde = valori.filter(v => v === 'verde').length;
    const conteggioGiallo = valori.filter(v => v === 'giallo').length;
    const conteggioRosso = valori.filter(v => v === 'rosso').length;
    const totali = valori.length;

    const obiettiviDaRipassare = obiettiviCorrenti
        .filter(obj => risposte[obj.id] === 'giallo' || risposte[obj.id] === 'rosso')
        .map(obj => obj.testo);

    let ripassoHTML = '';
    if (obiettiviDaRipassare.length > 0 && conteggioVerde < totali) {
        ripassoHTML = `
            <p><strong>🔍 Punti su cui concentrarsi:</strong></p>
            <ul>
                ${obiettiviDaRipassare.map(arg => `<li>${arg}</li>`).join('')}
            </ul>
        `;
    }

    if (conteggioVerde === totali) {
        return { colore: 'verde', emoji: '🌟', titolo: 'Eccellente!', messaggio: 'Hai padroneggiato tutti gli obiettivi di questa unità. Sei pronto per la prossima!', dettaglio: 'Continua così! 💪', ripasso: null };
    }

    if (conteggioRosso === totali) {
        return { colore: 'rosso', emoji: '📚', titolo: 'Ripassa l\'unità', messaggio: 'Non preoccuparti! Rivedi con calma i contenuti dell\'unità e poi riprova l\'autovalutazione.', dettaglio: 'Puoi chiedere aiuto al tuo insegnante se hai dubbi. 🤗', ripasso: ripassoHTML };
    }

    if (conteggioVerde >= totali / 2) {
        return { colore: 'verde', emoji: '💪', titolo: 'Ottimo lavoro!', messaggio: `Hai raggiunto ${conteggioVerde} su ${totali} obiettivi. Sei sulla strada giusta!`, dettaglio: `Rivedi gli ${conteggioGiallo + conteggioRosso} obiettivi su cui hai dubbi.`, ripasso: ripassoHTML };
    }

    if (conteggioGiallo >= conteggioRosso) {
        return { colore: 'giallo', emoji: '📖', titolo: 'Bene, ci sei quasi', messaggio: `Hai completato ${conteggioVerde + conteggioGiallo} su ${totali} obiettivi, ma alcuni richiedono ancora pratica.`, dettaglio: null, ripasso: ripassoHTML };
    }

    return { colore: 'rosso', emoji: '🤗', titolo: 'Non mollare!', messaggio: 'Hai fatto il primo passo importante: riconoscere le tue difficoltà.', dettaglio: 'Rivedi l\'unità con calma e chiedi aiuto al docente. Ce la puoi fare!', ripasso: ripassoHTML };
}

window.inviaAutovalutazione = async function(obiettivoId, stato) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/autovalutazione/${myUserNameCorrente}/${obiettivoId}`);
    await set(refRisposta, { stato: stato, timestamp: Date.now() });
};

window.resettaAutovalutazione = async function(studentName) {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può resettare le autovalutazioni.');
        return;
    }
    if (!confirm(`Resettare l'autovalutazione di ${studentName}?`)) return;
    const refRisposta = ref(db, `${basePathCorrente}/autovalutazione/${studentName}`);
    await remove(refRisposta);
};

window.resettaTutteAutovalutazioni = async function() {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può resettare le autovalutazioni.');
        return;
    }
    if (!confirm('Resettare TUTTE le autovalutazioni?')) return;

    const refTutte = ref(db, `${basePathCorrente}/autovalutazione`);
    const snap = await get(refTutte);
    if (snap.exists()) {
        const studenti = Object.keys(snap.val());
        for (const studente of studenti) {
            await remove(ref(db, `${basePathCorrente}/autovalutazione/${studente}`));
        }
    }
    alert('✅ Tutte le autovalutazioni sono state resettate!');
};
