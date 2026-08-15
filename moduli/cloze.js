// ================================================================
// MODULO: CLOZE (Scheda 8 - Esercizi di completamento)
// ================================================================
// Gestisce SOLO le fasi con esercizi di tipo cloze (fill-in-the-blanks).
// Le fasi con associazione o soloInformativa vengono IGNORATE.
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

        @media (max-width: 700px) {
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

// ================================================================
// GENERA HTML - SOLO PER LE FASI CON CLOZE
// ================================================================

export function generaCloze(datiFasi, isDocente = false) {
    iniettaCss();
    
    // 🔑 FILTRA: prende SOLO le fasi che hanno la proprietà "cloze"
    const fasiCloze = (datiFasi || []).filter(f => f?.cloze);
    if (!fasiCloze.length) return '';

    return `
        <div class="cloze-container">
            ${fasiCloze.map((fase, idx) => `
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
            `).join('')}
        </div>
    `;
}

// ================================================================
// INIZIALIZZAZIONE
// ================================================================

export function initCloze(app) {
    db = getDatabase(app);
    console.log('📦 cloze: inizializzato');
}

// ================================================================
// LISTENER - SOLO PER LE FASI CON CLOZE
// ================================================================

export function avviaClozeListener(basePath, fasiGrammatica, isDocente = false, username = '') {
    if (!db) {
        console.warn('⚠️ cloze: db non inizializzato!');
        return;
    }

    basePathCorrente = basePath;
    isDocenteCorrente = isDocente;
    myUserNameCorrente = username;

    // 🔑 FILTRA: prende SOLO i cloze dalle fasi che li contengono
    eserciziClozeCorrenti = (fasiGrammatica || [])
        .filter(f => f?.cloze)
        .map(f => f.cloze);

    eserciziClozeCorrenti.forEach(cloze => {
        const risposteRef = ref(db, `${basePath}/cloze/${cloze.id}/risposte`);
        onValue(risposteRef, (snap) => {
            aggiornaUICloze(cloze.id, snap.val() || {});
        });
    });
}

// ================================================================
// AGGIORNA UI
// ================================================================

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

// ================================================================
// FUNZIONI GLOBALI (Studente)
// ================================================================

window.inviaCloze = async function(idCloze) {
    if (!db || !myUserNameCorrente) {
        alert('Errore: non sei connesso.');
        return;
    }

    const inputs = document.querySelectorAll(`#cloze_testo_${idCloze} input`);
    const risposte = [];
    const risposteAccettate = eserciziClozeCorrenti.find(c => c.id === idCloze)?.risposte || [];
    let vuoto = false;
    let tutteCorrette = true;  // ✅ Qui è corretto

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

    // ✅ CORRETTO: usa "tutteCorrette" (senza "s" finale)
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

// ================================================================
// FUNZIONI GLOBALI (Docente)
// ================================================================

window.approvaCloze = async function(idCloze, studentName) {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può approvare.');
        return;
    }
    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${studentName}`);
    await update(refRisposta, {
        stato: 'approvata',
        suggerimento: '',
        timestamp: Date.now()
    });
};

window.richiediModificaCloze = async function(idCloze, studentName) {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può richiedere modifiche.');
        return;
    }

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
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può eliminare le risposte.');
        return;
    }
    if (!confirm(`Eliminare la risposta di ${studentName}?`)) return;

    const refRisposta = ref(db, `${basePathCorrente}/cloze/${idCloze}/risposte/${studentName}`);
    await remove(refRisposta);
};

window.resettaCloze = async function(idCloze) {
    if (!db || !isDocenteCorrente) {
        alert('Solo il docente può resettare.');
        return;
    }
    if (!confirm(`Resettare tutte le risposte per questo esercizio?`)) return;

    const refEsercizio = ref(db, `${basePathCorrente}/cloze/${idCloze}`);
    await remove(refEsercizio);
};
