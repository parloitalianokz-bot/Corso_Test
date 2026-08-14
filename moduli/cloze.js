// ================================================================
// MODULO: CLOZE (Scheda 8 - Esercizi di completamento)
// ================================================================
// Gestisce gli esercizi di completamento delle fasi grammaticali.
// Le risposte accettate sono definite come array di array nei dati.
// ================================================================

import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let eserciziClozeCorrenti = [];
let isDocenteCorrente = false;
let myUserNameCorrente = '';

function iniettaCss() {
    if (document.getElementById('cloze-css')) return;
    const style = document.createElement('style');
    style.id = 'cloze-css';
    style.textContent = `
        .cloze-container { margin: 16px 0; }
        .cloze-fase {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .cloze-fase .titolo-fase {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            font-size: 1.1rem;
            margin-bottom: 12px;
        }
        .cloze-dialoghi {
            background: #f0f4f8;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 12px;
            border-left: 4px solid var(--primary-color, #1a6e3a);
        }
        .cloze-dialoghi .dialogo {
            margin-bottom: 6px;
            font-size: 1rem;
            line-height: 1.6;
        }
        .cloze-dialoghi .dialogo .parlante {
            font-weight: 600;
            color: var(--primary-color, #1a6e3a);
        }
        .cloze-domande-lad {
            background: #fef9e7;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 16px;
            border-left: 4px solid #f1c40f;
        }
        .cloze-domande-lad p {
            margin: 4px 0;
            font-style: italic;
            color: #7d6608;
        }
        .cloze-esercizio {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            margin-top: 12px;
        }
        .cloze-esercizio .testo {
            font-size: 1.05rem;
            line-height: 1.8;
            margin-bottom: 12px;
        }
        .cloze-esercizio .testo .cloze-input {
            display: inline-block;
            margin: 0 4px;
        }
        .cloze-esercizio .testo .cloze-input input {
            width: 100px;
            padding: 4px 8px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        .cloze-esercizio .testo .cloze-input input:focus {
            border-color: var(--primary-color, #1a6e3a);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.1);
        }
        .cloze-esercizio .testo .cloze-input input.corretto {
            border-color: #27ae60;
            background: #eafaf1;
        }
        .cloze-esercizio .testo .cloze-input input.sbagliato {
            border-color: #e74c3c;
            background: #fdedec;
        }
        .cloze-esercizio .testo .cloze-input input:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .cloze-azioni {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 12px;
            align-items: center;
        }
        .cloze-azioni .btn-invia {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        .cloze-azioni .btn-invia:hover {
            background: #145a30;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 110, 58, 0.3);
        }
        .cloze-azioni .btn-invia:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .cloze-stato {
            margin-top: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            font-weight: 500;
            display: none;
        }
        .cloze-stato.visibile { display: block; }
        .cloze-stato.approvata {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .cloze-stato.in_attesa {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #f1c40f;
        }
        .cloze-stato.da_modificare {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .cloze-suggerimento {
            margin-top: 8px;
            padding: 8px 12px;
            background: #fff7e6;
            border-left: 4px solid #f0ad4e;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        .cloze-docente-panel {
            margin-top: 12px;
            padding: 12px 16px;
            background: #fff8e1;
            border-radius: 8px;
            border: 1px solid #f1c40f;
        }
        .cloze-docente-panel .titolo {
            font-weight: 700;
            color: #6b5300;
            margin-bottom: 8px;
        }
        .cloze-risposta-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            gap: 10px;
            flex-wrap: wrap;
            border-bottom: 1px solid #f0e8d0;
        }
        .cloze-risposta-item:last-child { border-bottom: none; }
        .cloze-risposta-item .studente { font-weight: 600; }
        .cloze-risposta-item .risposte { color: #333; font-size: 0.95rem; }
        .cloze-azioni-docente {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .cloze-azioni-docente button {
            border: none;
            border-radius: 6px;
            padding: 4px 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s ease;
        }
        .cloze-azioni-docente button:hover { transform: scale(1.05); }
        .btn-approva { background: #168a2f; color: #fff; }
        .btn-modifica { background: #f0ad4e; color: #fff; }
        .btn-elimina { background: #e74c3c; color: #fff; }
        .cloze-vuoto {
            color: #999;
            font-style: italic;
            padding: 4px 0;
        }

        .associazione-box {
            margin-top: 12px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 16px;
        }
        .associazione-istruzioni {
            margin-bottom: 14px;
            font-weight: 600;
            color: #234;
        }
        .associazione-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }
        .associazione-colonna {
            background: #fafafa;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #ececec;
        }
        .associazione-riga {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px;
            margin-bottom: 8px;
            background: white;
            border-radius: 10px;
            border: 2px solid transparent;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .associazione-riga.selezionata {
            border-color: var(--primary-color, #1a6e3a);
            background: #edf8f1;
        }
        .associazione-label {
            font-weight: 600;
            color: #223;
        }
        .associazione-slot,
        .associazione-voce {
            min-width: 90px;
            min-height: 34px;
            padding: 6px 10px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all .2s ease;
        }
        .associazione-slot {
            background: #f5f5f5;
            border: 1px dashed #cfcfcf;
            color: #888;
            cursor: pointer;
        }
        .associazione-slot.piena {
            background: #eafaf1;
            border-style: solid;
            color: #155724;
            cursor: pointer;
        }
        .associazione-voce {
            background: #eef4ff;
            border: 1px solid #cfe0ff;
            color: #224;
            cursor: pointer;
            margin-bottom: 8px;
        }
        .associazione-voce.usata {
            opacity: 0.35;
            text-decoration: line-through;
        }
        .associazione-azioni {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 14px;
        }
        .associazione-azioni button {
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 700;
        }
        .associazione-azioni .btn-verifica { background: var(--primary-color, #1a6e3a); color: #fff; }
        .associazione-azioni .btn-reset { background: #f39c12; color: #fff; }
        .associazione-esito {
            margin-top: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            display: none;
            font-weight: 600;
        }
        .associazione-esito.visibile { display: block; }
        .associazione-esito.ok { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .associazione-esito.ko { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

        @media (max-width: 700px) {
            .associazione-layout { grid-template-columns: 1fr; }
            .cloze-fase { padding: 12px; }
            .cloze-esercizio .testo .cloze-input input { width: 70px; }
            .cloze-risposta-item { flex-direction: column; align-items: stretch; }
        }
    `;
    document.head.appendChild(style);
}

function normalizza(valore) {
    return (valore || '').trim().toLowerCase();
}

function generaTestoConInput(clozeData) {
    if (!clozeData) return '';
    const testo = clozeData.testo || '';
    const id = clozeData.id || 'cloze';
    const parti = testo.split('____');
    let html = '';

    parti.forEach((parte, index) => {
        html += parte;
        if (index < parti.length - 1) {
            html += `<span class="cloze-input"><input type="text" id="cloze_input_${id}_${index}" placeholder="..." /></span>`;
        }
    });

    return html;
}

function generaAssociazione(fase) {
    const assoc = fase.associazione;
    if (!assoc) return '';

    const sinistra = assoc.sinistra || [];
    const destra = [...(assoc.destra || [])];

    return `
        <div class="associazione-box" id="associazione_box_${assoc.id}">
            <div class="associazione-istruzioni">${assoc.istruzioni || ''}</div>
            <div class="associazione-layout">
                <div class="associazione-colonna">
                    ${sinistra.map(item => `
                        <div class="associazione-riga" id="riga_${assoc.id}_${item.id}">
                            <div class="associazione-label">${item.label}</div>
                            <div class="associazione-slot" id="slot_${assoc.id}_${item.id}" onclick="window.spostaAssociazione('${assoc.id}','${item.id}', null)">vuoto</div>
                        </div>
                    `).join('')}
                </div>
                <div class="associazione-colonna">
                    ${destra.map(item => `
                        <div class="associazione-voce" id="voce_${assoc.id}_${item.id}" onclick="window.selezionaVoceAssociazione('${assoc.id}','${item.id}')">${item.label}</div>
                    `).join('')}
                </div>
            </div>

            <div class="associazione-azioni">
                <button class="btn-verifica" onclick="window.verificaAssociazione('${assoc.id}')">✅ Verifica</button>
                <button class="btn-reset" onclick="window.resetAssociazione('${assoc.id}')">🔄 Reset</button>
            </div>

            <div class="associazione-esito" id="associazione_esito_${assoc.id}"></div>
        </div>
    `;
}

export function generaCloze(datiFasi, isDocente = false) {
    iniettaCss();
    if (!datiFasi?.length) return '';

    return `
        <div class="cloze-container">
            ${datiFasi.map((fase, idx) => {
                if (fase.associazione) {
                    return `
                        <div class="cloze-fase" id="fase_${fase.id}">
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
                            ${generaAssociazione(fase)}
                        </div>
                    `;
                }

                if (fase.soloInformativa) {
                    return `
                        <div class="cloze-fase" id="fase_${fase.id}">
                            <div class="titolo-fase">${fase.titolo || `Fase ${idx + 1}`}</div>
                            ${fase.contenuto || ''}
                        </div>
                    `;
                }

                return `
                    <div class="cloze-fase" id="fase_${fase.id}">
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

                        ${fase.cloze ? `
                            <div class="cloze-esercizio" id="cloze_box_${fase.cloze.id}">
                                <div class="testo" id="cloze_testo_${fase.cloze.id}">
                                    ${generaTestoConInput(fase.cloze)}
                                </div>

                                <div class="cloze-azioni">
                                    <button class="btn-invia" id="btn_invia_${fase.cloze.id}" onclick="window.inviaCloze('${fase.cloze.id}')" ${isDocente ? 'disabled style="display:none;"' : ''}>Invia</button>
                                    <button class="btn-invia" id="btn_riapri_${fase.cloze.id}" onclick="window.riapriCloze('${fase.cloze.id}')" style="display:none; background:#f39c12;">✏️ Modifica</button>
                                </div>

                                <div class="cloze-stato" id="cloze_stato_${fase.cloze.id}"></div>
                                <div class="cloze-suggerimento" id="cloze_suggerimento_${fase.cloze.id}"></div>

                                ${isDocente ? `
                                    <div class="cloze-docente-panel" id="docente_${fase.cloze.id}">
                                        <div class="titolo">👨‍🏫 Pannello Docente</div>
                                        <div id="docente_lista_${fase.cloze.id}">
                                            <div class="cloze-vuoto">In attesa delle risposte degli studenti...</div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

export function initCloze(app) {
    db = getDatabase(app);
    console.log('📦 cloze: inizializzato');
}

export function avviaClozeListener(basePath, fasiGrammatica, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ cloze: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    isDocenteCorrente = isDocente;
    myUserNameCorrente = username;

    const eserciziCloze = [];
    fasiGrammatica.forEach(fase => {
        if (fase.cloze) eserciziCloze.push(fase.cloze);
    });

    eserciziClozeCorrenti = eserciziCloze;

    eserciziCloze.forEach(cloze => {
        const risposteRef = ref(db, `${basePath}/cloze/${cloze.id}/risposte`);
        onValue(risposteRef, (snap) => {
            aggiornaUICloze(cloze.id, snap.val() || {});
        });
    });

    eserciziCloze.forEach(cloze => {
        if (cloze.associazione) {
            const assocRef = ref(db, `${basePath}/associazione/${cloze.associazione.id}/associazioni`);
            onValue(assocRef, (snap) => {
                aggiornaUIAssociazione(cloze.associazione.id, snap.val() || {});
            });
        }
    });
}

function aggiornaUICloze(idCloze, dati) {
    const statoEl = document.getElementById(`cloze_stato_${idCloze}`);
    const suggEl = document.getElementById(`cloze_suggerimento_${idCloze}`);
    const btnInvia = document.getElementById(`btn_invia_${idCloze}`);
    const btnRiapri = document.getElementById(`btn_riapri_${idCloze}`);
    const docenteLista = document.getElementById(`docente_lista_${idCloze}`);
    const cloze = eserciziClozeCorrenti.find(c => c.id === idCloze);
    if (!cloze) return;

    const inputs = document.querySelectorAll(`#cloze_testo_${idCloze} input`);
    const risposteAccettate = cloze.risposte || [];
    const miaRisposta = dati[myUserNameCorrente] || null;

    if (miaRisposta) {
        const risposteSalvate = miaRisposta.risposte || [];
        inputs.forEach((input, index) => {
            if (risposteSalvate[index] !== undefined) input.value = risposteSalvate[index];
            input.disabled = true;
            if (risposteAccettate[index] && Array.isArray(risposteAccettate[index])) {
                const valoreUtente = normalizza(input.value);
                const isCorretto = risposteAccettate[index].some(acc => normalizza(acc) === valoreUtente);
                input.className = isCorretto ? 'corretto' : 'sbagliato';
            }
        });

        const stato = miaRisposta.stato || 'in_attesa';
        const statoLabel = stato === 'approvata' ? '✅ Approvata!' : stato === 'da_modificare' ? '✏️ Da modificare' : '⏳ In attesa di correzione...';
        const statoClass = stato === 'approvata' ? 'approvata' : stato === 'da_modificare' ? 'da_modificare' : 'in_attesa';

        if (statoEl) {
            statoEl.textContent = statoLabel;
            statoEl.className = `cloze-stato visibile ${statoClass}`;
        }

        if (suggEl) {
            if (miaRisposta.suggerimento) {
                suggEl.textContent = `💡 ${miaRisposta.suggerimento}`;
                suggEl.style.display = 'block';
            } else {
                suggEl.style.display = 'none';
            }
        }

        if (btnInvia) btnInvia.style.display = 'none';
        if (btnRiapri) btnRiapri.style.display = stato === 'da_modificare' ? 'inline-block' : 'none';
    } else {
        inputs.forEach((input) => {
            input.value = '';
            input.disabled = false;
            input.className = '';
        });

        if (statoEl) {
            statoEl.className = 'cloze-stato';
            statoEl.textContent = '';
        }
        if (suggEl) suggEl.style.display = 'none';
        if (btnInvia) btnInvia.style.display = 'inline-block';
        if (btnRiapri) btnRiapri.style.display = 'none';
    }

    if (docenteLista && isDocenteCorrente) {
        const studenti = Object.keys(dati);
        if (studenti.length === 0) {
            docenteLista.innerHTML = '<div class="cloze-vuoto">In attesa delle risposte degli studenti...</div>';
            return;
        }

        let html = '';
        studenti.forEach(nome => {
            const risposta = dati[nome];
            const stato = risposta?.stato || 'in_attesa';
            const icona = stato === 'approvata' ? '🟢' : stato === 'da_modificare' ? '🟡' : '⏳';

            const risposteTesto = (risposta?.risposte || []).map((r, i) => {
                const accettate = risposteAccettate[i] || [];
                const isCorretto = accettate.some(acc => normalizza(acc) === normalizza(r));
                return `<span style="${isCorretto ? 'color:#27ae60;' : 'color:#e74c3c;'}">${r || '?'}</span>`;
            }).join(' • ');

            html += `
                <div class="cloze-risposta-item">
                    <div>
                        <span class="studente">${nome}:</span>
                        <span class="risposte">${risposteTesto}</span>
                        <span style="font-size:0.9rem; margin-left:6px;">${icona}</span>
                        ${risposta?.suggerimento ? `<div style="font-size:0.85rem;color:#b26a00;">💡 ${risposta.suggerimento}</div>` : ''}
                    </div>
                    <div class="cloze-azioni-docente">
                        <button class="btn-approva" onclick="window.approvaCloze('${idCloze}','${nome}')">Approva</button>
                        <button class="btn-modifica" onclick="window.richiediModificaCloze('${idCloze}','${nome}')">Modifica</button>
                        <button class="btn-elimina" onclick="window.eliminaCloze('${idCloze}','${nome}')">✖</button>
                    </div>
                </div>
            `;
        });
        docenteLista.innerHTML = html;
    }
}

function aggiornaUIAssociazione(idAssoc, dati) {
    const esitoEl = document.getElementById(`associazione_esito_${idAssoc}`);
    const ass = (window.__associazioniCloze || []).find(a => a.id === idAssoc);
    if (!ass) return;
    const stato = dati[myUserNameCorrente]?.stato || 'in_attesa';
    if (!esitoEl) return;
    esitoEl.className = `associazione-esito visibile ${stato === 'approvata' ? 'ok' : 'ko'}`;
    esitoEl.textContent = stato === 'approvata' ? '✅ Perfetto! Tutte le associazioni sono corrette!' : '';
}

window.inviaCloze = async function(idCloze) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const inputs = document.querySelectorAll(`#cloze_testo_${idCloze} input`);
    const risposte = [];
    const risposteAccettate = eserciziClozeCorrenti.find(c => c.id === idCloze)?.risposte || [];
    let vuoto = false;
    let tutteCorrette = true;

    inputs.forEach((input, index) => {
        const valore = input.value.trim();
        risposte.push(valore);
        if (!valore) vuoto = true;

        if (risposteAccettate[index] && Array.isArray(risposteAccettate[index])) {
            const isCorretto = risposteAccettate[index].some(acc =>
                normalizza(acc) === normalizza(valore)
            );
            if (!isCorretto) tutteCorrette = false;
        }
    });

    if (vuoto) {
        alert('Compila tutti i campi!');
        return;
    }

    const stato = tutteCorrette ? 'approvata' : 'in_attesa';

    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${myUserNameCorrente}`);
    await set(refRisposta, {
        risposte,
        stato,
        suggerimento: '',
        timestamp: Date.now()
    });
};

window.riapriCloze = function(idCloze) {
    const inputs = document.querySelectorAll(`#cloze_testo_${idCloze} input`);
    inputs.forEach(input => {
        input.disabled = false;
        input.className = '';
    });

    const btnInvia = document.getElementById(`btn_invia_${idCloze}`);
    const btnRiapri = document.getElementById(`btn_riapri_${idCloze}`);
    if (btnInvia) btnInvia.style.display = 'inline-block';
    if (btnRiapri) btnRiapri.style.display = 'none';

    const statoEl = document.getElementById(`cloze_stato_${idCloze}`);
    if (statoEl) {
        statoEl.className = 'cloze-stato';
        statoEl.textContent = '';
    }
    const suggEl = document.getElementById(`cloze_suggerimento_${idCloze}`);
    if (suggEl) suggEl.style.display = 'none';
};

window.approvaCloze = async function(idCloze, studentName) {
    if (!db || !isDocenteCorrente) return;
    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'approvata',
        suggerimento: '',
        timestamp: Date.now()
    });
};

window.richiediModificaCloze = async function(idCloze, studentName) {
    if (!db || !isDocenteCorrente) return;

    const cloze = eserciziClozeCorrenti.find(c => c.id === idCloze);
    const suggerimentoDefault = cloze?.suggerimenti?.[0] || '📖 Rivedi le forme del verbo.';

    const suggerimento = prompt('✏️ Scrivi un suggerimento per lo studente:', suggerimentoDefault);
    if (suggerimento === null) return;
    if (suggerimento.trim() === '') {
        alert('Il suggerimento non può essere vuoto.');
        return;
    }

    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'da_modificare',
        suggerimento: suggerimento.trim(),
        timestamp: Date.now()
    });
};

window.eliminaCloze = async function(idCloze, studentName) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Eliminare la risposta di ${studentName}?`)) return;

    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${studentName}`);
    await remove(refRisposta);
};

window.resettaCloze = async function(idCloze) {
    if (!db || !isDocenteCorrente) return;
    if (!confirm(`Resettare tutte le risposte per questo esercizio?`)) return;

    const refEsercizio = ref(db, `${basePathCorrente}/cloze/${idCloze}`);
    await remove(refEsercizio);
};

window.__associazioniCloze = [];
window.spostaAssociazione = function(idAssoc, sinistraId, destraId) {
    const slot = document.getElementById(`slot_${idAssoc}_${sinistraId}`);
    if (!slot) return;
    slot.textContent = destraId ? destraId : 'vuoto';
    slot.dataset.destraId = destraId || '';
    slot.classList.toggle('piena', !!destraId);
};

window.selezionaVoceAssociazione = function(idAssoc, destraId) {
    const ass = window.__associazioniCloze.find(a => a.id === idAssoc);
    if (!ass) return;

    const used = ass._used || {};
    const slotVuoto = Object.keys(ass.associazioneCorretta || {}).find(k => !used[k]);
    if (!slotVuoto) return;

    used[slotVuoto] = destraId;
    ass._used = used;
    window.spostaAssociazione(idAssoc, slotVuoto, destraId);

    const voce = document.getElementById(`voce_${idAssoc}_${destraId}`);
    if (voce) voce.classList.add('usata');
};

window.verificaAssociazione = async function(idAssoc) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const ass = window.__associazioniCloze.find(a => a.id === idAssoc);
    if (!ass) return;

    const corrette = ass.associazioneCorretta || {};
    const slots = Object.keys(corrette);
    let tutteCorrette = true;

    slots.forEach(sinistraId => {
        const slot = document.getElementById(`slot_${idAssoc}_${sinistraId}`);
        const destraId = slot?.dataset?.destraId || '';
        if (destraId !== corrette[sinistraId]) tutteCorrette = false;
    });

    const stato = tutteCorrette ? 'approvata' : 'in_attesa';
    const payload = { associazioni: {}, stato, timestamp: Date.now() };

    slots.forEach(sinistraId => {
        const slot = document.getElementById(`slot_${idAssoc}_${sinistraId}`);
        payload.associazioni[sinistraId] = slot?.dataset?.destraId || '';
    });

    const refRisposta = ref(db, `${basePathCorrente}/associazione/${idAssoc}/associazioni/${myUserNameCorrente}`);
    await set(refRisposta, payload);

    const esitoEl = document.getElementById(`associazione_esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = `associazione-esito visibile ${tutteCorrette ? 'ok' : 'ko'}`;
        esitoEl.textContent = tutteCorrette ? '✅ Perfetto! Tutte le associazioni sono corrette!' : '❌ C’è qualche errore. Riprova!';
    }
};

window.resetAssociazione = function(idAssoc) {
    const ass = window.__associazioniCloze.find(a => a.id === idAssoc);
    if (!ass) return;

    Object.keys(ass.associazioneCorretta || {}).forEach(sinistraId => {
        window.spostaAssociazione(idAssoc, sinistraId, null);
    });

    document.querySelectorAll(`[id^="voce_${idAssoc}_"]`).forEach(el => el.classList.remove('usata'));

    const esitoEl = document.getElementById(`associazione_esito_${idAssoc}`);
    if (esitoEl) {
        esitoEl.className = 'associazione-esito';
        esitoEl.textContent = '';
    }
};
