// ================================================================
// MODULO: SCELTA PERSONALE
// ================================================================

import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

(function() {
    const css = `
        .scelta-container {
            margin: 20px 0;
            padding: 22px;
            background:
                linear-gradient(135deg, rgba(26,110,58,0.08), rgba(206,43,55,0.06)),
                var(--scelta-bg, url('img/sfondo_italia.webp'));
            background-size: cover;
            background-position: center;
            border-radius: 16px;
            border: 2px solid var(--primary-color);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            overflow: hidden;
        }

        .scelta-domanda {
            font-weight: bold;
            font-size: 1.25rem;
            color: var(--primary-color);
            margin-bottom: 16px;
            text-align: center;
            padding: 12px 14px;
            background: rgba(255,255,255,0.88);
            border-radius: 12px;
            border: 1px solid rgba(26,110,58,0.12);
        }

        .scelta-opzioni {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 15px 0;
        }

        .scelta-option {
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .scelta-option:hover {
            transform: translateY(-5px);
        }

        .scelta-immagine {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            border-radius: 16px;
            border: 4px solid rgba(206,43,55,0.18);
            transition: all 0.3s ease;
            box-shadow: 0 8px 18px rgba(0,0,0,0.14);
            background: #fff;
            padding: 6px;
            box-sizing: border-box;
        }

        .scelta-immagine:hover {
            border-color: var(--primary-color);
            box-shadow: 0 12px 24px rgba(0,0,0,0.2);
            transform: scale(1.02);
        }

        .scelta-etichetta {
            margin-top: 8px;
            font-weight: bold;
            font-size: 0.95em;
            color: var(--text-color);
            background: rgba(255,255,255,0.85);
            border-radius: 999px;
            display: inline-block;
            padding: 4px 12px;
        }

        .scelta-risposta {
            margin: 15px 0 20px 0;
            padding: 15px;
            background: rgba(255,255,255,0.9);
            border-radius: 12px;
            border: 1px solid #e9ecef;
            text-align: center;
        }

        .scelta-frase-base {
            font-size: 1.1em;
            font-weight: bold;
            color: #2c3e50;
        }

        .scelta-testo {
            font-size: 1.1em;
            margin-top: 5px;
            min-height: 30px;
            color: #999;
            font-style: italic;
        }

        .scelta-bacheca {
            margin-top: 15px;
            padding: 15px;
            background: rgba(255,255,255,0.92);
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }

        .scelta-bacheca h4 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 0.95em;
        }

        .scelta-bacheca-docente {
            margin-top: 18px;
            text-align: center;
        }

        .scelta-reset {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background: var(--secondary-color);
            color: white;
            font-weight: bold;
        }

        @media (max-width: 1024px) and (min-width: 601px) {
            .scelta-opzioni {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
        }

        @media (max-width: 600px) {
            .scelta-container {
                padding: 14px;
            }

            .scelta-domanda {
                font-size: 1.05rem;
                padding: 10px 12px;
            }

            .scelta-opzioni {
                grid-template-columns: 1fr;
                gap: 15px;
                max-width: 300px;
                margin: 15px auto;
            }

            .scelta-immagine {
                max-width: 220px;
                margin: 0 auto;
            }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

let dbGlobal = null;
let BASE_PATH_GLOBAL = '';

export function initSceltaPersonale(app) {
    dbGlobal = app;
    console.log('📦 sceltaPersonale: database inizializzato con app personalizzata');
}

export function setBasePath(basePath) {
    BASE_PATH_GLOBAL = basePath;
}

export function generaSceltaPersonale(config, isDocente) {
    const data = config?.elicitazione?.sceltaPersonale;
    if (!data) return '';
    const id = data.idFirebase || 'scelta_personale';

    let opzioniHtml = '';
    (data.opzioni || []).forEach((opt) => {
        opzioniHtml += `
        <div class="scelta-option" onclick="${isDocente ? '' : `scegliOpzione('${id}', '${opt.id}', '${opt.etichetta}')`}">
            <img src="${opt.img}" alt="${opt.etichetta}" class="scelta-immagine" id="img_${id}_${opt.id}">
            <div class="scelta-etichetta">${opt.etichetta}</div>
        </div>
        `;
    });

    return `
    <div class="scelta-container" style="${data.background ? `--scelta-bg: url('${data.background}')` : ''}">
        <div class="scelta-domanda">${data.domanda}</div>
        <div class="scelta-opzioni">${opzioniHtml}</div>
        ${isDocente ? `
        <div class="scelta-bacheca-docente">
            <button class="scelta-reset" onclick="resetSceltaPersonale('${id}')">Reset risposte</button>
        </div>
        ` : `
        <div class="scelta-risposta">
            <div class="scelta-frase-base">${data.fraseBase}</div>
            <div class="scelta-testo" id="scelta_testo_${id}">
                Scegli un'opzione...
            </div>
        </div>
        `}
        <div class="scelta-bacheca" id="scelta_bacheca_${id}">
            <h4>💬 Le risposte della classe:</h4>
            <div id="scelta_risposte_${id}">Ancora nessuna risposta...</div>
        </div>
    </div>
    `;
}

window.scegliOpzione = function(id, opzioneId, etichetta) {
    document.querySelectorAll(`#img_${id}_${opzioneId}`).forEach(img => {
        img.style.borderColor = 'var(--primary-color)';
        img.style.borderWidth = '4px';
        img.style.boxShadow = '0 0 20px rgba(26, 110, 58, 0.3)';
    });

    document.querySelectorAll('.scelta-immagine').forEach(img => {
        if (img.id !== `img_${id}_${opzioneId}`) {
            img.style.borderColor = '#ddd';
            img.style.borderWidth = '2px';
            img.style.boxShadow = 'none';
        }
    });

    const testoEl = document.getElementById(`scelta_testo_${id}`);
    if (testoEl) {
        testoEl.innerHTML = `<strong>${etichetta}</strong>`;
        testoEl.style.color = 'var(--primary-color)';
        testoEl.style.fontStyle = 'normal';
    }

    if (!dbGlobal) {
        console.warn('⚠️ dbGlobal non inizializzato! Salvataggio simulato.');
        return;
    }

    const myUserName = localStorage.getItem('parlo_italiano_utente') ? JSON.parse(localStorage.getItem('parlo_italiano_utente')).username : 'Studente';
    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/scelta_personale/${id}/${myUserName}`;

    set(ref(database, percorso), {
        opzione: opzioneId,
        etichetta: etichetta,
        timestamp: Date.now()
    }).catch((error) => {
        console.error('❌ Errore durante il salvataggio:', error);
    });
};

export function avviaSceltaPersonaleListener(basePath, myUserName, isDocente) {
    if (!dbGlobal) {
        console.warn('⚠️ dbGlobal non inizializzato!');
        return;
    }

    BASE_PATH_GLOBAL = basePath;
    const database = getDatabase(dbGlobal);

    onValue(ref(database, `${BASE_PATH_GLOBAL}/scelta_personale`), (snapshot) => {
        const allData = snapshot.val() || {};

        Object.keys(allData).forEach(id => {
            const container = document.getElementById(`scelta_risposte_${id}`);
            if (!container) return;

            const studenti = allData[id] || {};
            const nomi = Object.keys(studenti);

            if (nomi.length === 0) {
                container.innerHTML = 'Ancora nessuna risposta...';
                return;
            }

            let html = '';
            nomi.forEach(nome => {
                const risposta = studenti[nome];
                html += `
                <div style="padding: 4px 0; border-bottom: 1px solid #eee;">
                    <b>${nome}</b> studia l'italiano ${risposta.etichetta}
                </div>
                `;
            });

            container.innerHTML = html || 'Ancora nessuna risposta...';
        });
    });
}

function pulisciUIScelta(id) {
    const testoEl = document.getElementById(`scelta_testo_${id}`);
    const bachecaEl = document.getElementById(`scelta_risposte_${id}`);

    if (testoEl) {
        testoEl.innerHTML = 'Scegli un’opzione...';
        testoEl.style.color = '#999';
        testoEl.style.fontStyle = 'italic';
    }

    if (bachecaEl) {
        bachecaEl.innerHTML = 'Ancora nessuna risposta...';
    }
}

window.resetSceltaPersonale = async function(id) {
    if (!dbGlobal) return;
    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/scelta_personale/${id}`;

    try {
        await remove(ref(database, percorso));
        pulisciUIScelta(id);
    } catch (error) {
        console.error('❌ Errore durante il reset:', error);
    }
};
