// ================================================================
// MODULO: ASSOCIAZIONE (Universale)
// ================================================================
// Gestisce esercizi di associazione/riordino dove lo studente
// scambia elementi di posto cliccando su due caselle.
// ================================================================

import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziCorrenti = [];
let myUserNameCorrente = '';
let ultimaSelezione = null;

function iniettaCss() {
    if (document.getElementById('associazione-universale-css')) return;

    const style = document.createElement('style');
    style.id = 'associazione-universale-css';
    style.textContent = `
        .assoc-universale-container {
            margin: 16px 0;
            display: flex;
            justify-content: center;
        }
        .assoc-universale-fase {
            width: 100%;
            max-width: 860px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            box-sizing: border-box;
        }
        .assoc-universale-fase .titolo-fase {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.1rem;
            margin-bottom: 12px;
        }
        .assoc-universale-istruzioni {
            margin-bottom: 14px;
            font-weight: 600;
            color: #234;
        }
        .assoc-universale-layout {
            display: flex;
            justify-content: center;
        }
        .assoc-universale-colonna {
            width: 100%;
            max-width: 720px;
            background: #fff;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #ececec;
            box-sizing: border-box;
        }
        .assoc-universale-riga {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            align-items: center;
            padding: 10px 12px;
            margin-bottom: 8px;
            background: #fafafa;
            border-radius: 10px;
            border: 2px solid transparent;
            min-height: 44px;
            box-sizing: border-box;
        }
        .assoc-universale-riga.selezionata {
            border-color: var(--primary-color, #1a6e3a);
            background: #edf8f1;
        }
        .assoc-universale-label {
            text-align: right;
            font-weight: 700;
            color: #223;
        }
        .assoc-universale-casella {
            min-height: 36px;
            padding: 6px 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            transition: all .2s ease;
            background: #eef4ff;
            border: 2px solid #cfe0ff;
            color: #224;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
        }
        .assoc-universale-casella:hover {
            background: #dbe8ff;
            transform: scale(1.02);
        }
        .assoc-universale-casella.selezionata {
            border-color: var(--primary-color, #1a6e3a);
            background: #edf8f1;
            transform: scale(1.04);
            box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.2);
        }
        .assoc-universale-casella.corretta {
            border-color: #27ae60;
            background: #eafaf1;
        }
        .assoc-universale-casella.sbagliata {
            border-color: #e74c3c;
            background: #fdedec;
        }
        .assoc-universale-azioni {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 14px;
        }
        .assoc-universale-azioni button {
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 700;
        }
        .assoc-universale-azioni .btn-verifica {
            background: var(--primary-color, #1a6e3a);
            color: #fff;
        }
        .assoc-universale-azioni .btn-reset {
            background: #f39c12;
            color: #fff;
        }
        .assoc-universale-esito {
            margin-top: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            display: none;
            font-weight: 600;
        }
        .assoc-universale-esito.visibile { display: block; }
        .assoc-universale-esito.ok {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .assoc-universale-esito.ko {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        @media (max-width: 700px) {
            .assoc-universale-fase { padding: 12px; }
            .assoc-universale-colonna { padding: 10px; }
            .assoc-universale-riga { grid-template-columns: 1fr 1fr; gap: 6px; }
            .assoc-universale-label { text-align: left; }
        }
    `;
    document.head.appendChild(style);
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function generaAssociazione(fasi, isDocente = false) {
    iniettaCss();
    if (!fasi?.length) return '';

    return `
        <div class="assoc-universale-container">
            ${fasi.map((fase, idx) => {
                const assoc = fase.associazione;
                if (!assoc) return '';

                const sinistra = assoc.sinistra || [];
                const destra = shuffleArray(assoc.destra || []);

                return `
                    <div class="assoc-universale-fase" id="assoc_fase_${assoc.id}">
                        <div class="titolo-fase">${fase.titolo || `Fase ${idx + 1}`}</div>

                        ${fase.dialoghi ? `
                            <div class="cloze-dialoghi">
                                ${fase.dialoghi.map(d => `
                                    <div class="dialogo">
                                        <span class="parlante">${d.parlanti || ''}</span>
                                        ${d.testo || ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${fase.domandeLAD ? `
                            <div class="cloze-domande-lad">
                                ${fase.domandeLAD.map(d => `<p>${d}</p>`).join('')}
                            </div>
                        ` : ''}

                        <div class="assoc-universale-istruzioni">${assoc.istruzioni || ''}</div>

                        <div class="assoc-universale-layout" id="assoc_layout_${assoc.id}">
                            <div class="assoc-universale-colonna">
                                ${sinistra.map((item, index) => `
                                    <div class="assoc-universale-riga" id="riga_${assoc.id}_${item.id}">
                                        <div class="assoc-universale-label">${item.label}</div>
                                        <div class="assoc-universale-casella"
                                             id="casella_${assoc.id}_${item.id}"
                                             data-assoc-id="${assoc.id}"
                                             data-sinistra-id="${item.id}"
                                             data-indice="${index}"
                                             onclick="window.selezionaCasellaAssociazione('${assoc.id}','${item.id}')">
                                            ${destra[index]?.label || ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="assoc-universale-azioni">
                            <button class="btn-verifica" onclick="window.verificaAssociazione('${assoc.id}')">✅ Verifica</button>
                            <button class="btn-reset" onclick="window.resetAssociazione('${assoc.id}')">🔄 Reset</button>
                        </div>

                        <div class="assoc-universale-esito" id="esito_${assoc.id}"></div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

export function initAssociazione(app) {
    db = getDatabase(app);
    console.log('📦 associazione: inizializzato');
}

export function avviaAssociazioneListener(basePath, fasiGrammatica, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ associazione: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    myUserNameCorrente = username;

    const esercizi = (fasiGrammatica || [])
        .filter(f => f.associazione)
        .map(f => f.associazione);

    eserciziCorrenti = esercizi;

    esercizi.forEach(assoc => {
        const refDati = ref(db, `${basePath}/associazione/${assoc.id}/dati`);
        onValue(refDati, (snap) => {
            aggiornaUIAssociazione(assoc.id, snap.val() || {});
        });
    });
}

function aggiornaUIAssociazione(idAssoc, dati) {
    const esitoEl = document.getElementById(`esito_${idAssoc}`);
    const ass = eserciziCorrenti.find(a => a.id === idAssoc);
    if (!ass || !esitoEl) return;

    const miaRisposta = dati[myUserNameCorrente] || null;

    if (miaRisposta) {
        const ordine = miaRisposta.ordine || [];
        if (ordine.length) {
            ass.sinistra.forEach((item, index) => {
                const casella = document.getElementById(`casella_${idAssoc}_${item.id}`);
                if (casella && ordine[index]) {
                    casella.textContent = ordine[index];
                }
            });
        }

        const stato = miaRisposta.stato || 'in_attesa';
        esitoEl.className = `assoc-universale-esito visibile ${stato === 'approvata' ? 'ok' : 'ko'}`;
        esitoEl.textContent = stato === 'approvata'
            ? '✅ Perfetto! Tutte le associazioni sono corrette!'
            : (stato === 'da_modificare' ? '✏️ Da modificare' : '⏳ In attesa di correzione...');
    } else {
        esitoEl.className = 'assoc-universale-esito';
        esitoEl.textContent = '';
    }
}

window.selezionaCasellaAssociazione = function(idAssoc, sinistraId) {
    const casella = document.getElementById(`casella_${idAssoc}_${sinistraId}`);
    if (!casella) return;

    const ass = eserciziCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    if (!ultimaSelezione) {
        casella.classList.add('selezionata');
        ultimaSelezione = { idAssoc, sinistraId, casella };
        return;
    }

    if (ultimaSelezione.sinistraId === sinistraId && ultimaSelezione.idAssoc === idAssoc) {
        casella.classList.remove('selezionata');
        ultimaSelezione = null;
        return;
    }

    const primaCasella = ultimaSelezione.casella;
    const valore1 = primaCasella.textContent;
    const valore2 = casella.textContent;

    primaCasella.textContent = valore2;
    casella.textContent = valore1;

    primaCasella.classList.remove('selezionata');
    casella.classList.remove('selezionata');
    ultimaSelezione = null;

    salvaOrdineAssociazione(idAssoc);
};

window.salvaOrdineAssociazione = async function(idAssoc) {
    if (!db || !myUserNameCorrente) return;

    const ass = eserciziCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const ordine = [];
    ass.sinistra.forEach(item => {
        const casella = document.getElementById(`casella_${idAssoc}_${item.id}`);
        ordine.push(casella?.textContent || '');
    });

    const refDati = ref(db, `${basePathCorrente}/associazione/${idAssoc}/dati/${myUserNameCorrente}`);
    await set(refDati, {
        ordine,
        stato: 'in_attesa',
        timestamp: Date.now()
    });
};

window.verificaAssociazione = async function(idAssoc) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const ass = eserciziCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const ordineCorretto = ass.ordineCorretto || [];
    const ordineCorrente = [];

    ass.sinistra.forEach(item => {
        const casella = document.getElementById(`casella_${idAssoc}_${item.id}`);
        ordineCorrente.push(casella?.textContent || '');
    });

    let tutteCorrette = true;
    ordineCorrente.forEach((valore, index) => {
        if (valore !== ordineCorretto[index]) tutteCorrette = false;
    });

    ass.sinistra.forEach((item, index) => {
        const casella = document.getElementById(`casella_${idAssoc}_${item.id}`);
        if (casella) {
            casella.classList.remove('corretta', 'sbagliata');
            if (tutteCorrette) {
                casella.classList.add('corretta');
            } else {
                const isCorretto = ordineCorrente[index] === ordineCorretto[index];
                casella.classList.add(isCorretto ? 'corretta' : 'sbagliata');
            }
        }
    });

    const stato = tutteCorrette ? 'approvata' : 'in_attesa';

    const refDati = ref(db, `${basePathCorrente}/associazione/${idAssoc}/dati/${myUserNameCorrente}`);
    await set(refDati, {
        ordine: ordineCorrente,
        stato,
        timestamp: Date.now()
    });

    const esitoEl = document.getElementById(`esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = `assoc-universale-esito visibile ${tutteCorrette ? 'ok' : 'ko'}`;
        esitoEl.textContent = tutteCorrette
            ? '✅ Perfetto! Tutte le associazioni sono corrette!'
            : '❌ C\'è qualche errore. Riprova!';
    }
};

window.resetAssociazione = function(idAssoc) {
    const ass = eserciziCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const destra = shuffleArray(ass.destra || []);

    ass.sinistra.forEach((item, index) => {
        const casella = document.getElementById(`casella_${idAssoc}_${item.id}`);
        if (casella) {
            casella.textContent = destra[index]?.label || '';
            casella.classList.remove('corretta', 'sbagliata', 'selezionata');
        }
    });

    const esitoEl = document.getElementById(`esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = 'assoc-universale-esito';
        esitoEl.textContent = '';
    }

    ultimaSelezione = null;
    salvaOrdineAssociazione(idAssoc);
};
