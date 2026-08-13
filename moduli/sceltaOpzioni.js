import { getDatabase, ref, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let basePathCorrente = '';
let domandeCorrenti = [];
let isDocenteCorrente = false;
let myUserNameCorrente = '';

function iniettaCss() {
    if (document.getElementById('scelta-opzioni-css')) return;
    const style = document.createElement('style');
    style.id = 'scelta-opzioni-css';
    style.textContent = `
        .quiz-box{background:#fff;border:1px solid #ddd;border-radius:14px;padding:16px;margin:14px 0;box-shadow:0 2px 8px rgba(0,0,0,.05)}
        .quiz-title{margin:0 0 8px;font-size:1.05rem}
        .quiz-istruzioni{margin:0 0 12px;color:#555}
        .quiz-options{display:grid;gap:10px}
        .quiz-option{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #ccc;border-radius:10px;cursor:pointer;user-select:none;transition:.2s}
        .quiz-option:hover{background:#f7f7f7}
        .quiz-option.selected{border-color:#2a7fff;background:#eef5ff}
        .quiz-marker{font-size:1.1rem;width:18px;text-align:center}
        .quiz-feedback{margin-top:10px;font-weight:600}
        .quiz-feedback.ok{color:#168a2f}
        .quiz-feedback.no{color:#c62828}
        .quiz-feedback.wait{color:#8a6d3b}
        .quiz-feedback.fix{color:#b26a00}
        .quiz-board{margin-top:12px;padding:10px;background:#fafafa;border-radius:10px;border:1px dashed #ddd}
        .quiz-board-item{display:flex;justify-content:space-between;gap:10px;padding:6px 0;font-size:.95rem;align-items:flex-start;border-bottom:1px solid #eee}
        .quiz-board-item:last-child{border-bottom:none}
        .quiz-board-actions{display:flex;gap:8px;flex-wrap:wrap}
        .quiz-small{font-size:.9rem;color:#666}
        .quiz-reset-btn,.quiz-delete-btn,.quiz-approve-btn,.quiz-fix-btn{border:none;border-radius:8px;padding:6px 10px;cursor:pointer}
        .quiz-reset-btn{background:#ce2b37;color:#fff}
        .quiz-delete-btn{background:#eee;color:#333}
        .quiz-approve-btn{background:#168a2f;color:#fff}
        .quiz-fix-btn{background:#f0ad4e;color:#fff}
        .quiz-suggestion{margin-top:8px;padding:8px 10px;background:#fff7e6;border-left:4px solid #f0ad4e;border-radius:8px}
        .quiz-disabled{opacity:.55;cursor:not-allowed}
    `;
    document.head.appendChild(style);
}

function statoRispostaLabel(stato) {
    if (stato === 'approvata') return '✅ Approvata';
    if (stato === 'da_modificare') return '✏️ Da modificare';
    return '⏳ In attesa';
}

function getTestoOpzione(q, indice) {
    return q?.opzioni?.[indice] || '';
}

export function generaSceltaOpzioni(config, isDocente = false) {
    iniettaCss();
    if (!config?.domande?.length) return '';

    return `
        <div class="scheda-quiz">
            <h3 class="scheda-lettura-titolo">${config.titolo || '🧠 Capiamo il testo'}</h3>
            <p class="scheda-istruzioni">${config.istruzioni || ''}</p>
            ${config.domande.map((q, idx) => `
                <div class="quiz-box" id="quiz_box_${q.id}">
                    <h4 class="quiz-title">${idx + 1}. ${q.testo}</h4>
                    <div class="quiz-options">
                        ${q.opzioni.map((opt, i) => `
                            <div class="quiz-option" id="quiz_opt_${q.id}_${i}" onclick="window.inviaRispostaOpzione('${q.id}', ${i})">
                                <span class="quiz-marker">⬜</span>
                                <span>${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback" id="feedback_${q.id}"></div>
                    <div class="quiz-board" id="board_${q.id}" ${isDocente ? '' : 'style="display:none;"'}></div>
                    ${isDocente ? `<div style="margin-top:10px;"><button class="quiz-reset-btn" onclick="window.resettaSceltaOpzioni('${q.id}')">Reset domanda</button></div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function aggiornaUIDomanda(idDomanda, datiDomanda) {
    const domanda = domandeCorrenti.find(d => d.id === idDomanda);
    if (!domanda) return;

    const feedback = document.getElementById(`feedback_${idDomanda}`);
    const board = document.getElementById(`board_${idDomanda}`);
    const voti = datiDomanda?.voti || {};
    const studenti = Object.keys(voti);

    document.querySelectorAll(`[id^="quiz_opt_${idDomanda}_"]`).forEach(el => {
        el.classList.remove('selected', 'quiz-disabled');
        const marker = el.querySelector('.quiz-marker');
        if (marker) marker.textContent = '⬜';
    });

    if (board && isDocenteCorrente) {
        board.style.display = 'block';
        board.innerHTML = studenti.length
            ? `<strong>Risposte:</strong><div class="quiz-small">${studenti.map(stud => {
                const risposta = voti[stud] || {};
                const indice = risposta?.indice;
                const stato = risposta?.stato || 'in_attesa';
                const suggerimento = risposta?.suggerimento || '';
                const testoOpzione = getTestoOpzione(domanda, indice);
                return `
                    <div class="quiz-board-item">
                        <div>
                            <div><strong>${stud}</strong>: ${testoOpzione}</div>
                            <div class="quiz-small">${statoRispostaLabel(stato)}</div>
                            ${suggerimento ? `<div class="quiz-suggestion">💡 ${suggerimento}</div>` : ''}
                        </div>
                        <div class="quiz-board-actions">
                            <button class="quiz-approve-btn" onclick="window.approvaRispostaOpzione('${idDomanda}', '${stud}')">Approva</button>
                            <button class="quiz-fix-btn" onclick="window.richiediModificaRispostaOpzione('${idDomanda}', '${stud}')">Modifica</button>
                            <button class="quiz-delete-btn" onclick="window.eliminaRispostaOpzione('${idDomanda}', '${stud}')">✖</button>
                        </div>
                    </div>
                `;
            }).join('')}</div>`
            : `<strong>Risposte:</strong> nessuna risposta ancora.`;
    }

    const mioVoto = voti?.[myUserNameCorrente];

    if (feedback) {
        if (!mioVoto) {
            feedback.textContent = 'Scegli una risposta.';
            feedback.className = 'quiz-feedback wait';
            domanda.opzioni.forEach((opt, i) => {
                const el = document.getElementById(`quiz_opt_${idDomanda}_${i}`);
                if (el) {
                    el.style.pointerEvents = 'auto';
                    el.style.opacity = '1';
                    el.onclick = () => window.inviaRispostaOpzione(idDomanda, i);
                }
            });
        } else if (mioVoto.stato === 'da_modificare') {
            feedback.textContent = mioVoto.suggerimento
                ? `✏️ Da modificare. ${mioVoto.suggerimento}`
                : '✏️ Da modificare.';
            feedback.className = 'quiz-feedback fix';
            domanda.opzioni.forEach((opt, i) => {
                const el = document.getElementById(`quiz_opt_${idDomanda}_${i}`);
                if (el) {
                    el.style.pointerEvents = 'auto';
                    el.style.opacity = '1';
                    el.onclick = () => window.inviaRispostaOpzione(idDomanda, i);
                }
            });
        } else if (mioVoto.stato === 'approvata') {
            feedback.textContent = '✅ Risposta approvata!';
            feedback.className = 'quiz-feedback ok';
            domanda.opzioni.forEach((opt, i) => {
                const el = document.getElementById(`quiz_opt_${idDomanda}_${i}`);
                if (el) {
                    el.classList.add('quiz-disabled');
                    el.style.pointerEvents = 'none';
                    el.onclick = () => {};
                }
            });
        } else {
            feedback.textContent = '⏳ Risposta inviata, in attesa di revisione.';
            feedback.className = 'quiz-feedback wait';
            domanda.opzioni.forEach((opt, i) => {
                const el = document.getElementById(`quiz_opt_${idDomanda}_${i}`);
                if (el) {
                    el.classList.add('quiz-disabled');
                    el.style.pointerEvents = 'none';
                    el.onclick = () => {};
                }
            });
        }

        if (mioVoto?.indice !== undefined) {
            const opt = document.getElementById(`quiz_opt_${idDomanda}_${mioVoto.indice}`);
            if (opt) {
                opt.classList.add('selected');
                const marker = opt.querySelector('.quiz-marker');
                if (marker) marker.textContent = '●';
            }
        }
    }
}

export function avviaSceltaOpzioniListener(basePath, domande, isDocente = false, myUserName = '') {
    if (!db) return;
    basePathCorrente = basePath;
    domandeCorrenti = domande || [];
    isDocenteCorrente = isDocente;
    myUserNameCorrente = myUserName;

    domandeCorrenti.forEach(q => {
        const domandaRef = ref(db, `${basePath}/scelta_opzioni/${q.id}`);
        onValue(domandaRef, (snap) => {
            const datiDomanda = snap.val() || {};
            aggiornaUIDomanda(q.id, datiDomanda);
        });
    });
}

window.inviaRispostaOpzione = async function(idDomanda, indice) {
    if (!db || !myUserNameCorrente) return;

    const domanda = domandeCorrenti.find(d => d.id === idDomanda);
    if (!domanda) return;

    const domandaRef = ref(db, `${basePathCorrente}/scelta_opzioni/${idDomanda}/voti/${myUserNameCorrente}`);
    await set(domandaRef, {
        indice,
        stato: 'in_attesa',
        suggerimento: ''
    });
};

window.approvaRispostaOpzione = async function(idDomanda, studentName) {
    if (!db || !isDocenteCorrente) return;

    const domandaRef = ref(db, `${basePathCorrente}/scelta_opzioni/${idDomanda}/voti/${studentName}`);
    await update(domandaRef, {
        stato: 'approvata',
        suggerimento: ''
    });
};

window.richiediModificaRispostaOpzione = async function(idDomanda, studentName) {
    if (!db || !isDocenteCorrente) return;

    const domanda = domandeCorrenti.find(d => d.id === idDomanda);
    if (!domanda) return;

    const rispostaRef = ref(db, `${basePathCorrente}/scelta_opzioni/${idDomanda}/voti/${studentName}`);
    const suggerimento = domanda.suggerimento || 'Prova a rileggere il testo e correggere la risposta.';

    await update(rispostaRef, {
        stato: 'da_modificare',
        suggerimento: suggerimento
    });
};

window.eliminaRispostaOpzione = async function(idDomanda, studentName) {
    if (!db || !isDocenteCorrente) return;
    const domandaRef = ref(db, `${basePathCorrente}/scelta_opzioni/${idDomanda}/voti/${studentName}`);
    await remove(domandaRef);
};

window.resettaSceltaOpzioni = async function(idDomanda) {
    if (!db || !isDocenteCorrente) return;
    const domandaRef = ref(db, `${basePathCorrente}/scelta_opzioni/${idDomanda}`);
    await remove(domandaRef);
};

export function initSceltaOpzioni(app) {
    db = getDatabase(app);
}