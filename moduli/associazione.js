// ================================================================
// MODULO: ASSOCIAZIONE GRAFICA
// ================================================================

import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziAssociazioneCorrenti = [];
let myUserNameCorrente = '';

function iniettaCss() {
    if (document.getElementById('associazione-grafica-css')) return;

    const style = document.createElement('style');
    style.id = 'associazione-grafica-css';
    style.textContent = `
        .assoc-container { margin: 16px 0; }
        .assoc-fase {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .assoc-fase .titolo-fase {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.1rem;
            margin-bottom: 12px;
        }
        .assoc-istruzioni {
            margin-bottom: 14px;
            font-weight: 600;
            color: #234;
        }
        .assoc-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }
        .assoc-colonna {
            background: #fff;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #ececec;
        }
        .assoc-riga {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            margin-bottom: 8px;
            background: #fafafa;
            border-radius: 10px;
            border: 2px solid transparent;
            flex-wrap: wrap;
        }
        .assoc-riga.selezionata {
            border-color: var(--primary-color, #1a6e3a);
            background: #edf8f1;
        }
        .assoc-label {
            min-width: 120px;
            font-weight: 700;
            color: #223;
        }
        .assoc-slot {
            min-height: 36px;
            min-width: 110px;
            padding: 6px 10px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            transition: all .2s ease;
            background: #f5f5f5;
            border: 1px dashed #cfcfcf;
            color: #888;
            cursor: pointer;
        }
        .assoc-slot.piena {
            background: #eafaf1;
            border-style: solid;
            color: #155724;
        }
        .assoc-voce {
            background: #eef4ff;
            border: 1px solid #cfe0ff;
            color: #224;
            cursor: pointer;
            border-radius: 10px;
            padding: 10px 12px;
            margin-bottom: 8px;
            font-weight: 700;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .assoc-voce.usata {
            opacity: 0.35;
            text-decoration: line-through;
        }
        .assoc-azioni {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 14px;
        }
        .assoc-azioni button {
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 700;
        }
        .assoc-azioni .btn-verifica { background: var(--primary-color, #1a6e3a); color: #fff; }
        .assoc-azioni .btn-reset { background: #f39c12; color: #fff; }
        .assoc-esito {
            margin-top: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            display: none;
            font-weight: 600;
        }
        .assoc-esito.visibile { display: block; }
        .assoc-esito.ok {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .assoc-esito.ko {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        @media (max-width: 700px) {
            .assoc-layout { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(style);
}

function scegliDisposizioneCasuale(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function generaAssociazioneHTML(fase) {
    const assoc = fase.associazione;
    if (!assoc) return '';

    const sinistra = assoc.sinistra || [];
    const destra = scegliDisposizioneCasuale(assoc.destra || []);

    return `
        <div class="assoc-fase" id="assoc_fase_${assoc.id}">
            <div class="titolo-fase">${fase.titolo || ''}</div>
            <div class="assoc-istruzioni">${assoc.istruzioni || ''}</div>
            <div class="assoc-layout">
                <div class="assoc-colonna">
                    ${sinistra.map(item => `
                        <div class="assoc-riga" id="assoc_riga_${assoc.id}_${item.id}">
                            <div class="assoc-label">${item.label}</div>
                            <div class="assoc-slot" id="assoc_slot_${assoc.id}_${item.id}" onclick="window.spostaAssociazione('${assoc.id}','${item.id}', null)">vuoto</div>
                        </div>
                    `).join('')}
                </div>
                <div class="assoc-colonna" id="assoc_destra_${assoc.id}">
                    ${destra.map(item => `
                        <div class="assoc-voce" id="assoc_voce_${assoc.id}_${item.id}" onclick="window.selezionaVoceAssociazione('${assoc.id}','${item.id}')">${item.label}</div>
                    `).join('')}
                </div>
            </div>
            <div class="assoc-azioni">
                <button class="btn-verifica" onclick="window.verificaAssociazione('${assoc.id}')">✅ Verifica</button>
                <button class="btn-reset" onclick="window.resetAssociazione('${assoc.id}')">🔄 Reset</button>
            </div>
            <div class="assoc-esito" id="assoc_esito_${assoc.id}"></div>
        </div>
    `;
}

export function generaAssociazione(fasi, isDocente = false) {
    iniettaCss();
    if (!fasi?.length) return '';
    return `<div class="assoc-container">${fasi.map(fase => fase.associazione ? generaAssociazioneHTML(fase) : '').join('')}</div>`;
}

export function initAssociazione(app) {
    db = getDatabase(app);
}

export function avviaAssociazioneListener(basePath, fasiGrammatica, isDocente = false, username = '') {
    if (!db) return;

    basePathCorrente = basePath;
    myUserNameCorrente = username;
    eserciziAssociazioneCorrenti = (fasiGrammatica || []).filter(f => f.associazione).map(f => f.associazione);

    eserciziAssociazioneCorrenti.forEach(assoc => {
        const risposteRef = ref(db, `${basePath}/associazione/${assoc.id}/associazioni`);
        onValue(risposteRef, snap => {
            aggiornaUIAssociazione(assoc.id, snap.val() || {});
        });
    });
}

function getAccettate(corrette, sinistraId) {
    const v = corrette?.[sinistraId];
    return Array.isArray(v) ? v : [v];
}

function trovaSlotDaVoce(idAssoc, destraId) {
    return document.querySelector(`.assoc-slot[data-assoc-id="${idAssoc}"][data-destra-id="${destraId}"]`);
}

function aggiornaUIAssociazione(idAssoc, dati) {
    const esitoEl = document.getElementById(`assoc_esito_${idAssoc}`);
    const ass = eserciziAssociazioneCorrenti.find(a => a.id === idAssoc);
    if (!ass || !esitoEl) return;

    document.querySelectorAll(`.assoc-slot[data-assoc-id="${idAssoc}"]`).forEach(slot => {
        slot.textContent = 'vuoto';
        slot.dataset.destraId = '';
        slot.classList.remove('piena');
        const riga = document.getElementById(slot.dataset.rigaId);
        if (riga) riga.classList.remove('selezionata');
    });

    document.querySelectorAll(`.assoc-voce[data-assoc-id="${idAssoc}"]`).forEach(voce => {
        voce.classList.remove('usata');
    });

    const miaRisposta = dati[myUserNameCorrente] || null;
    if (!miaRisposta) {
        esitoEl.className = 'assoc-esito';
        esitoEl.textContent = '';
        return;
    }

    const associazioni = miaRisposta.associazioni || {};
    Object.entries(associazioni).forEach(([sinistraId, destraId]) => {
        if (destraId) window.spostaAssociazione(idAssoc, sinistraId, destraId, true);
    });

    const stato = miaRisposta.stato || 'in_attesa';
    esitoEl.className = `assoc-esito visibile ${stato === 'approvata' ? 'ok' : 'ko'}`;
    esitoEl.textContent = stato === 'approvata'
        ? '✅ Perfetto! Tutte le associazioni sono corrette!'
        : (stato === 'da_modificare' ? '✏️ Da modificare' : '⏳ In attesa di correzione...');
}

window.spostaAssociazione = function(idAssoc, sinistraId, destraId, daFirebase = false) {
    const slot = document.getElementById(`assoc_slot_${idAssoc}_${sinistraId}`);
    if (!slot) return;

    const ass = eserciziAssociazioneCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const vecchiaDestraId = slot.dataset.destraId || '';
    if (vecchiaDestraId && !destraId) {
        const vecchiaVoce = document.getElementById(`assoc_voce_${idAssoc}_${vecchiaDestraId}`);
        if (vecchiaVoce) vecchiaVoce.classList.remove('usata');
    }

    slot.dataset.assocId = idAssoc;
    slot.dataset.rigaId = `assoc_riga_${idAssoc}_${sinistraId}`;
    slot.textContent = destraId ? (ass.destra.find(x => x.id === destraId)?.label || destraId) : 'vuoto';
    slot.dataset.destraId = destraId || '';
    slot.classList.toggle('piena', !!destraId);

    const riga = document.getElementById(`assoc_riga_${idAssoc}_${sinistraId}`);
    if (riga) riga.classList.toggle('selezionata', !!destraId);

    if (!daFirebase && destraId) {
        const voce = document.getElementById(`assoc_voce_${idAssoc}_${destraId}`);
        if (voce) voce.classList.add('usata');
    }
};

window.selezionaVoceAssociazione = function(idAssoc, destraId) {
    const ass = eserciziAssociazioneCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const voce = document.getElementById(`assoc_voce_${idAssoc}_${destraId}`);
    if (voce && voce.classList.contains('usata')) {
        const slotUsato = document.querySelector(`.assoc-slot[data-assoc-id="${idAssoc}"][data-destra-id="${destraId}"]`);
        if (slotUsato) {
            const sinistraId = slotUsato.id.replace(`assoc_slot_${idAssoc}_`, '');
            window.spostaAssociazione(idAssoc, sinistraId, null);
        }
        return;
    }

    const libero = (ass.sinistra || []).find(item => {
        const slot = document.getElementById(`assoc_slot_${idAssoc}_${item.id}`);
        return slot && !slot.dataset.destraId;
    });

    if (!libero) return;

    window.spostaAssociazione(idAssoc, libero.id, destraId);
};

window.verificaAssociazione = async function(idAssoc) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const ass = eserciziAssociazioneCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    const corrette = ass.associazioneCorretta || {};
    const slots = Object.keys(corrette);
    let tutteCorrette = true;
    const associazioniDaSalvare = {};

    slots.forEach(sinistraId => {
        const slot = document.getElementById(`assoc_slot_${idAssoc}_${sinistraId}`);
        const destraId = slot?.dataset?.destraId || '';
        associazioniDaSalvare[sinistraId] = destraId;

        const accettate = getAccettate(corrette, sinistraId).filter(Boolean);
        if (!accettate.includes(destraId)) tutteCorrette = false;
    });

    const stato = tutteCorrette ? 'approvata' : 'in_attesa';
    const refRisposta = ref(db, `${basePathCorrente}/associazione/${idAssoc}/associazioni/${myUserNameCorrente}`);
    await set(refRisposta, {
        associazioni: associazioniDaSalvare,
        stato,
        timestamp: Date.now()
    });

    const esitoEl = document.getElementById(`assoc_esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = `assoc-esito visibile ${tutteCorrette ? 'ok' : 'ko'}`;
        esitoEl.textContent = tutteCorrette
            ? '✅ Perfetto! Tutte le associazioni sono corrette!'
            : '❌ C’è qualche errore. Riprova!';
    }
};

window.resetAssociazione = function(idAssoc) {
    const ass = eserciziAssociazioneCorrenti.find(a => a.id === idAssoc);
    if (!ass) return;

    (ass.sinistra || []).forEach(item => {
        window.spostaAssociazione(idAssoc, item.id, null);
    });

    (ass.destra || []).forEach(item => {
        const voce = document.getElementById(`assoc_voce_${idAssoc}_${item.id}`);
        if (voce) voce.classList.remove('usata');
    });

    const esitoEl = document.getElementById(`assoc_esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = 'assoc-esito';
        esitoEl.textContent = '';
    }
};
