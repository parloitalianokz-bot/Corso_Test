// ================================================================
// MODULO: RIORDINA DIALOGHI (Scheda 7) - VERSIONE DEFINITIVA
// ================================================================

import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziCorrenti = [];
let isDocenteCorrente = false;
let ordiniCorrenti = {};
let listenerAttivi = {};

// ================================================================
// 1. FUNZIONE HELPER: ORDINI UGUALI
// ================================================================

function ordiniUguali(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
}

// ================================================================
// 2. CSS
// ================================================================

function iniettaCss() {
    if (document.getElementById('riordina-dialoghi-css')) return;
    const style = document.createElement('style');
    style.id = 'riordina-dialoghi-css';
    style.textContent = `
        .riordina-container { margin: 16px 0; }
        .riordina-container h3 {
            text-align: center;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        
        .riordina-card {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }
        
        .riordina-card .immagine {
            text-align: center;
            margin-bottom: 12px;
        }
        .riordina-card .immagine img {
            max-width: 100%;
            max-height: 200px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .riordina-card .titolo-dialogo {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 8px;
            font-size: 1.05rem;
        }
        
        .riordina-frase-fissa {
            background: #e8f0fe;
            border: 2px solid var(--primary-color, #1a6e3a);
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--primary-color, #1a6e3a);
        }
        
        .riordina-lista {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin: 10px 0;
        }
        
        .riordina-item {
            display: flex;
            align-items: center;
            gap: 10px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px 12px;
            transition: all 0.2s ease;
        }
        .riordina-item:hover {
            border-color: var(--primary-color, #1a6e3a);
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        
        .riordina-item .testo {
            flex: 1;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .riordina-item .frecce {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex-shrink: 0;
        }
        .riordina-item .frecce button {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 4px;
            width: 30px;
            height: 24px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .riordina-item .frecce button:hover:not(:disabled) {
            background: var(--secondary-color, #ce2b37);
            transform: scale(1.05);
        }
        .riordina-item .frecce button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            transform: none;
        }
        
        .riordina-item .numero-posizione {
            font-weight: 700;
            color: #999;
            font-size: 0.85rem;
            min-width: 24px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .riordina-azioni {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 12px;
            align-items: center;
        }
        .riordina-azioni .btn-verifica {
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        .riordina-azioni .btn-verifica:hover {
            background: #219a52;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
        }
        .riordina-azioni .btn-reset {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        .riordina-azioni .btn-reset:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }
        
        .riordina-feedback {
            margin-top: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 600;
            display: none;
        }
        .riordina-feedback.success {
            display: block;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .riordina-feedback.error {
            display: block;
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        @media (max-width: 600px) {
            .riordina-card { padding: 12px; }
            .riordina-item { padding: 8px 10px; flex-wrap: wrap; }
            .riordina-item .testo { font-size: 0.9rem; }
            .riordina-item .frecce button { width: 28px; height: 22px; font-size: 0.7rem; }
            .riordina-azioni { flex-direction: column; }
            .riordina-azioni button { width: 100%; }
        }
    `;
    document.head.appendChild(style);
}

// ================================================================
// 3. FUNZIONE SHUFFLE (Fisher-Yates)
// ================================================================

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ================================================================
// 4. GENERA HTML
// ================================================================

export function generaRiordinaDialoghi(dati, isDocente = false) {
    iniettaCss();
    if (!dati?.esercizi?.length) return '';

    return `
        <div class="riordina-container">
            <h3>${dati.titolo || '🧩 Riordina i dialoghi'}</h3>
            <p class="scheda-istruzioni">${dati.istruzioni || 'Metti in ordine le frasi.'}</p>

            ${dati.esercizi.map((esercizio, idx) => `
                <div class="riordina-card" id="card_${esercizio.id}">
                    ${esercizio.immagine ? `
                        <div class="immagine">
                            <img src="${esercizio.immagine}" alt="Illustrazione per il dialogo ${idx + 1}" loading="lazy">
                        </div>
                    ` : ''}

                    <div class="titolo-dialogo">Dialogo ${idx + 1}</div>

                    ${(esercizio.frasiFisse || []).map(frase => `
                        <div class="riordina-frase-fissa">${frase}</div>
                    `).join('')}

                    <div class="riordina-lista" id="lista_${esercizio.id}">
                        <div style="color:#999; font-style:italic; text-align:center; padding:10px;">
                            Caricamento frasi...
                        </div>
                    </div>

                    <div class="riordina-azioni">
                        <button class="btn-verifica" onclick="window.verificaRiordino('${esercizio.id}')">
                            ✅ Verifica Ordine
                        </button>
                        ${isDocente ? `
                            <button class="btn-reset" onclick="window.resetRiordino('${esercizio.id}')">
                                🔄 Reset
                            </button>
                        ` : ''}
                    </div>

                    <div class="riordina-feedback" id="feedback_${esercizio.id}"></div>
                </div>
            `).join('')}
        </div>
    `;
}

// ================================================================
// 5. INIZIALIZZAZIONE
// ================================================================

export function initRiordinaDialoghi(app) {
    db = getDatabase(app);
    console.log('📦 riordinaDialoghi: inizializzato');
}

// ================================================================
// 6. LISTENER (con cleanup)
// ================================================================

export function avviaRiordinaDialoghiListener(basePath, esercizi, isDocente = false) {
    if (!db) {
        console.warn('⚠️ riordinaDialoghi: db non inizializzato!');
        return;
    }

    Object.keys(listenerAttivi).forEach(id => {
        if (listenerAttivi[id]) {
            listenerAttivi[id]();
            delete listenerAttivi[id];
        }
    });

    basePathCorrente = basePath;
    eserciziCorrenti = esercizi || [];
    isDocenteCorrente = isDocente;

    eserciziCorrenti.forEach(esercizio => {
        const ordineRef = ref(db, `${basePath}/riordinaDialoghi/${esercizio.id}/ordine`);

        get(ordineRef).then(snap => {
            if (!snap.exists()) {
                const ids = esercizio.frasiMobili.map(f => f.id);
                const ordineRandom = shuffleArray(ids);
                set(ordineRef, ordineRandom);
            }
        });

        const unsubscribe = onValue(ordineRef, (snap) => {
            ordiniCorrenti[esercizio.id] = snap.val() || [];
            aggiornaUIEsercizio(esercizio.id);
        });

        listenerAttivi[esercizio.id] = unsubscribe;
    });
}

// ================================================================
// 7. AGGIORNA UI
// ================================================================

function aggiornaUIEsercizio(idEsercizio) {
    const esercizio = eserciziCorrenti.find(e => e.id === idEsercizio);
    if (!esercizio) return;

    const container = document.getElementById(`lista_${idEsercizio}`);
    if (!container) return;

    const ordine = ordiniCorrenti[idEsercizio] || [];

    if (ordine.length === 0) {
        container.innerHTML = `<div style="color:#999; font-style:italic; text-align:center; padding:10px;">Nessuna frase disponibile.</div>`;
        return;
    }

    const mappaTesti = {};
    esercizio.frasiMobili.forEach(f => {
        mappaTesti[f.id] = f.testo;
    });

    let html = '';
    ordine.forEach((idFrase, index) => {
        const testo = mappaTesti[idFrase] || '[Frase non trovata]';
        const isFirst = index === 0;
        const isLast = index === ordine.length - 1;

        html += `
            <div class="riordina-item" id="item_${idEsercizio}_${idFrase}">
                <span class="numero-posizione">${index + 1}.</span>
                <span class="testo">${testo}</span>
                <div class="frecce">
                    <button onclick="window.spostaFrase('${idEsercizio}', ${index}, -1)" ${isFirst ? 'disabled' : ''} aria-label="Sposta su">⬆️</button>
                    <button onclick="window.spostaFrase('${idEsercizio}', ${index}, 1)" ${isLast ? 'disabled' : ''} aria-label="Sposta giù">⬇️</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ================================================================
// 8. SPOSTA FRASE
// ================================================================

window.spostaFrase = function(idEsercizio, index, direzione) {
    if (!db) return;

    const ordine = ordiniCorrenti[idEsercizio] || [];
    const nuovoIndex = index + direzione;
    
    if (nuovoIndex < 0 || nuovoIndex >= ordine.length) return;
    
    const temp = ordine[index];
    ordine[index] = ordine[nuovoIndex];
    ordine[nuovoIndex] = temp;
    
    const ordineRef = ref(db, `${basePathCorrente}/riordinaDialoghi/${idEsercizio}/ordine`);
    set(ordineRef, ordine);
};

// ================================================================
// 9. VERIFICA ORDINE (con supporto varianti)
// ================================================================

window.verificaRiordino = function(idEsercizio) {
    const esercizio = eserciziCorrenti.find(e => e.id === idEsercizio);
    if (!esercizio) return;

    const ordineCorrente = ordiniCorrenti[idEsercizio] || [];
    const ordineCorretto = esercizio.ordineCorretto || [];
    const variantiAccettate = esercizio.variantiAccettate || [];

    const feedbackEl = document.getElementById(`feedback_${idEsercizio}`);
    if (!feedbackEl) return;

    // ✅ Verifica usando la funzione helper
    let corretto = false;
    
    // 1. Controlla l'ordine corretto principale
    if (ordiniUguali(ordineCorrente, ordineCorretto)) {
        corretto = true;
    }
    
    // 2. Controlla le varianti accettate
    if (!corretto) {
        for (const variante of variantiAccettate) {
            if (ordiniUguali(ordineCorrente, variante)) {
                corretto = true;
                break;
            }
        }
    }

    feedbackEl.className = 'riordina-feedback';

    if (corretto) {
        feedbackEl.className = 'riordina-feedback success';
        feedbackEl.innerHTML = '🎉 Bravissimi! L\'ordine è perfetto!';
        
        ordineCorrente.forEach((idFrase) => {
            const item = document.getElementById(`item_${idEsercizio}_${idFrase}`);
            if (item) {
                item.style.borderColor = '#27ae60';
                item.style.background = '#eafaf1';
            }
        });
    } else {
        feedbackEl.className = 'riordina-feedback error';
        feedbackEl.innerHTML = '❌ C\'è qualche errore. Usate le frecce per riprovare!';
        
        document.querySelectorAll(`#lista_${idEsercizio} .riordina-item`).forEach(item => {
            item.style.borderColor = '';
            item.style.background = '';
        });
    }
};

// ================================================================
// 10. RESET (Docente)
// ================================================================

window.resetRiordino = async function(idEsercizio) {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può resettare l\'ordine.');
        return;
    }

    const esercizio = eserciziCorrenti.find(e => e.id === idEsercizio);
    if (!esercizio) return;

    if (!confirm(`Vuoi rimescolare questo dialogo per tutti?`)) return;

    const ids = esercizio.frasiMobili.map(f => f.id);
    const nuovoOrdine = shuffleArray(ids);

    const ordineRef = ref(db, `${basePathCorrente}/riordinaDialoghi/${idEsercizio}/ordine`);
    await set(ordineRef, nuovoOrdine);

    const feedbackEl = document.getElementById(`feedback_${idEsercizio}`);
    if (feedbackEl) {
        feedbackEl.className = 'riordina-feedback';
        feedbackEl.textContent = '';
    }
};
