// ================================================================
// MODULO: AUTOVALUTAZIONE (Scheda 12)
// ================================================================
// Lo studente si autovaluta su 3 livelli per ogni obiettivo.
// Il sistema genera un feedback personalizzato.
// Le risposte sono salvate su Firebase.
// ================================================================

import { getDatabase, ref, set, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let myUserNameCorrente = '';
let obiettiviCorrenti = [];
let isDocenteCorrente = false;  // ✅ AGGIUNTO

// ================================================================
// 1. CSS
// ================================================================

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
        
        .autovalutazione-feedback.verde {
            background: #d4edda;
            border-color: #27ae60;
            color: #155724;
        }
        .autovalutazione-feedback.giallo {
            background: #fff3cd;
            border-color: #f1c40f;
            color: #856404;
        }
        .autovalutazione-feedback.rosso {
            background: #f8d7da;
            border-color: #e74c3c;
            color: #721c24;
        }
        .autovalutazione-feedback.misto {
            background: #e8f4f8;
            border-color: #3498db;
            color: #2c3e50;
        }
        
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
        .autovalutazione-reset button:hover {
            background: #c0392b;
        }
        
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
        .autovalutazione-ripasso-box li {
            margin-bottom: 4px;
        }
        
        @media (max-width: 600px) {
            .autovalutazione-livelli {
                flex-direction: column;
            }
            .autovalutazione-livelli button {
                min-width: 100%;
            }
            .autovalutazione-feedback .emoji { font-size: 2rem; }
        }
    `;
    document.head.appendChild(style);
}

// ================================================================
// 2. GENERA HTML
// ================================================================

export function generaAutovalutazione(dati, isDocente = false) {
    iniettaCss();
    if (!dati?.obiettivi?.length) return '';

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
            
            ${isDocente ? `
                <div class="autovalutazione-reset">
                    <button onclick="window.resettaTutteAutovalutazioni()">🔄 Reset tutte le autovalutazioni</button>
                </div>
            ` : ''}
        </div>
    `;
}

// ================================================================
// 3. INIZIALIZZAZIONE
// ================================================================

export function initAutovalutazione(app) {
    db = getDatabase(app);
    console.log('📦 autovalutazione: inizializzato');
}

// ================================================================
// 4. LISTENER
// ================================================================

export function avviaAutovalutazioneListener(basePath, obiettivi, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ autovalutazione: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    myUserNameCorrente = username;
    obiettiviCorrenti = obiettivi || [];
    isDocenteCorrente = isDocente;  // ✅ IMPOSTATO

    const autoRef = ref(db, `${basePath}/autovalutazione/${username}`);
    onValue(autoRef, (snap) => {
        aggiornaUIAutovalutazione(obiettivi, snap.val() || {});
    });
}

// ================================================================
// 5. AGGIORNA UI
// ================================================================

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

// ================================================================
// 6. GENERA FEEDBACK PERSONALIZZATO
// ================================================================

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
        return {
            colore: 'verde',
            emoji: '🌟',
            titolo: 'Eccellente!',
            messaggio: 'Hai padroneggiato tutti gli obiettivi di questa unità. Sei pronto per la prossima!',
            dettaglio: 'Continua così! 💪',
            ripasso: null
        };
    }
    
    if (conteggioRosso === totali) {
        return {
            colore: 'rosso',
            emoji: '📚',
            titolo: 'Ripassa l\'unità',
            messaggio: 'Non preoccuparti! Rivedi con calma i contenuti dell\'unità e poi riprova l\'autovalutazione.',
            dettaglio: 'Puoi chiedere aiuto al docente se hai dubbi. 🤗',
            ripasso: ripassoHTML
        };
    }
    
    if (conteggioVerde >= totali / 2) {
        return {
            colore: 'verde',
            emoji: '💪',
            titolo: 'Ottimo lavoro!',
            messaggio: `Hai raggiunto ${conteggioVerde} su ${totali} obiettivi. Sei sulla strada giusta!`,
            dettaglio: `Rivedi gli ${conteggioGiallo + conteggioRosso} obiettivi su cui hai dubbi.`,
            ripasso: ripassoHTML
        };
    }
    
    if (conteggioGiallo >= conteggioRosso) {
        return {
            colore: 'giallo',
            emoji: '📖',
            titolo: 'Bene, ci sei quasi',
            messaggio: `Hai completato ${conteggioVerde + conteggioGiallo} su ${totali} obiettivi, ma alcuni richiedono ancora pratica.`,
            dettaglio: null,
            ripasso: ripassoHTML
        };
    }
    
    return {
        colore: 'rosso',
        emoji: '🤗',
        titolo: 'Non mollare!',
        messaggio: 'Hai fatto il primo passo importante: riconoscere le tue difficoltà.',
        dettaglio: 'Rivedi l\'unità con calma e chiedi aiuto al docente. Ce la puoi fare!',
        ripasso: ripassoHTML
    };
}

// ================================================================
// 7. FUNZIONI GLOBALI (Studente)
// ================================================================

window.inviaAutovalutazione = async function(obiettivoId, stato) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }
    
    const refRisposta = ref(db, `${basePathCorrente}/autovalutazione/${myUserNameCorrente}/${obiettivoId}`);
    await set(refRisposta, {
        stato: stato,
        timestamp: Date.now()
    });
};

// ================================================================
// 8. FUNZIONI GLOBALI (Docente)
// ================================================================

window.resettaAutovalutazione = async function(studentName) {
    if (!db || !isDocenteCorrente) {  // ✅ USA isDocenteCorrente
        alert('Solo il docente può resettare le autovalutazioni.');
        return;
    }
    if (!confirm(`Resettare l'autovalutazione di ${studentName}?`)) return;
    
    const refRisposta = ref(db, `${basePathCorrente}/autovalutazione/${studentName}`);
    await remove(refRisposta);
};

window.resettaTutteAutovalutazioni = async function() {
    if (!db || !isDocenteCorrente) {  // ✅ USA isDocenteCorrente
        alert('Solo il docente può resettare le autovalutazioni.');
        return;
    }
    if (!confirm('Resettare TUTTE le autovalutazioni?')) return;
    
    const refTutte = ref(db, `${basePathCorrente}/autovalutazione`);
    const snap = await get(refTutte);  // ✅ get() è ora importato
    if (snap.exists()) {
        const studenti = Object.keys(snap.val());
        for (const studente of studenti) {
            const refStudente = ref(db, `${basePathCorrente}/autovalutazione/${studente}`);
            await remove(refStudente);
        }
    }
    alert('✅ Tutte le autovalutazioni sono state resettate!');
};
