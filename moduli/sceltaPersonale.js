// ================================================================
// MODULO: SCELTA PERSONALE
// ================================================================

// ================================================================
// 1. IMPORTA FIREBASE
// ================================================================

import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ================================================================
// 2. INIETTA CSS
// ================================================================

(function() {
    const css = `
        .scelta-container { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border: 2px solid var(--primary-color); }
        .scelta-domanda { font-weight: bold; font-size: 1.2rem; color: var(--primary-color); margin-bottom: 15px; text-align: center; }
        
        .scelta-opzioni { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 15px 0; }
        
        .scelta-option { text-align: center; cursor: pointer; transition: all 0.3s ease; }
        .scelta-option:hover { transform: translateY(-5px); }
        
        .scelta-immagine { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 12px; border: 3px solid #ddd; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .scelta-immagine:hover { border-color: var(--primary-color); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        
        .scelta-etichetta { margin-top: 6px; font-weight: bold; font-size: 0.9em; color: var(--text-color); }
        
        .scelta-risposta { margin: 15px 0 20px 0; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef; text-align: center; }
        .scelta-frase-base { font-size: 1.1em; font-weight: bold; color: #2c3e50; }
        .scelta-testo { font-size: 1.1em; margin-top: 5px; min-height: 30px; color: #999; font-style: italic; }
        
        .scelta-bacheca { margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef; }
        .scelta-bacheca h4 { margin-top: 0; color: #2c3e50; font-size: 0.95em; }
        
        @media (max-width: 1024px) and (min-width: 601px) {
            .scelta-opzioni { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
        
        @media (max-width: 600px) {
            .scelta-opzioni { grid-template-columns: 1fr; gap: 15px; max-width: 300px; margin: 15px auto; }
            .scelta-immagine { max-width: 200px; margin: 0 auto; }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

// ================================================================
// 3. VARIABILI GLOBALI
// ================================================================

let dbGlobal = null;
let BASE_PATH_GLOBAL = '';

// ================================================================
// 4. FUNZIONI DI INIZIALIZZAZIONE
// ================================================================

export function initSceltaPersonale(app) {
    dbGlobal = app;
    console.log('📦 sceltaPersonale: database inizializzato con app personalizzata');
}

export function setBasePath(basePath) {
    BASE_PATH_GLOBAL = basePath;
}

// ================================================================
// 5. GENERATORE HTML
// ================================================================

export function generaSceltaPersonale(config, isDocente) {
    const data = config?.elicitazione?.sceltaPersonale;
    if (!data) return '';
    
    const id = data.idFirebase || 'scelta_personale';
    
    let opzioniHtml = '';
    (data.opzioni || []).forEach((opt) => {
        opzioniHtml += `
        <div class="scelta-option" onclick="scegliOpzione('${id}', '${opt.id}', '${opt.etichetta}')">
            <img src="${opt.img}" alt="${opt.etichetta}" class="scelta-immagine" id="img_${id}_${opt.id}">
            <div class="scelta-etichetta">${opt.etichetta}</div>
        </div>
        `;
    });
    
    return `
    <div class="scelta-container">
        <div class="scelta-domanda">${data.domanda}</div>
        <div class="scelta-opzioni">${opzioniHtml}</div>
        <div class="scelta-risposta">
            <div class="scelta-frase-base">${data.fraseBase}</div>
            <div class="scelta-testo" id="scelta_testo_${id}">
                Scegli un'opzione...
            </div>
        </div>
        <div class="scelta-bacheca" id="scelta_bacheca_${id}">
            <h4>💬 Le risposte della classe:</h4>
            <div id="scelta_risposte_${id}">Ancora nessuna risposta...</div>
        </div>
    </div>
    `;
}

// ================================================================
// 6. FUNZIONE GLOBALE PER LA SCELTA
// ================================================================

window.scegliOpzione = function(id, opzioneId, etichetta) {
    console.log('🔍 sceltaPersonale: opzione selezionata', opzioneId, etichetta);
    
    // 1. Evidenzia l'immagine scelta
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
    
    // 2. Mostra la frase completa
    const testoEl = document.getElementById(`scelta_testo_${id}`);
    if (testoEl) {
        testoEl.innerHTML = `<strong>${etichetta}</strong>`;
        testoEl.style.color = 'var(--primary-color)';
        testoEl.style.fontStyle = 'normal';
    }
    
    // 3. Salva su Firebase
    if (!dbGlobal) {
        console.warn('⚠️ dbGlobal non inizializzato! Salvataggio simulato.');
        mostraConferma(id, etichetta, true);
        return;
    }
    
    const myUserName = localStorage.getItem('parlo_italiano_username') || 'Studente';
    const database = getDatabase(dbGlobal);
    const percorso = `${BASE_PATH_GLOBAL}/scelta_personale/${id}/${myUserName}`;
    
    set(ref(database, percorso), {
        opzione: opzioneId,
        etichetta: etichetta,
        timestamp: Date.now()
    }).then(() => {
        console.log('✅ Risposta salvata su Firebase');
        mostraConferma(id, etichetta, false);
    }).catch((error) => {
        console.error('❌ Errore durante il salvataggio:', error);
        mostraConferma(id, etichetta, true);
    });
};

// ================================================================
// 7. FUNZIONE PER MOSTRARE LA CONFERMA
// ================================================================

function mostraConferma(id, etichetta, simulato) {
    const bacheca = document.getElementById(`scelta_risposte_${id}`);
    if (!bacheca) return;
    
    const msg = simulato 
        ? `✅ Hai scelto: <strong>${etichetta}</strong> (salvataggio simulato)`
        : `✅ Hai scelto: <strong>${etichetta}</strong>`;
    
    bacheca.innerHTML = `
        <div style="padding:8px;background:#d4edda;border-radius:4px;color:#155724;">
            ${msg}
        </div>
    `;
}

// ================================================================
// 8. LISTENER PER LE RISPOSTE DELLA CLASSE
// ================================================================

export function avviaSceltaPersonaleListener(basePath, myUserName, isDocente) {
    if (!dbGlobal) {
        console.warn('⚠️ dbGlobal non inizializzato!');
        return;
    }
    
    BASE_PATH_GLOBAL = basePath;
    const database = getDatabase(dbGlobal);
    
    // Ascolta le risposte
    onValue(ref(database, `${BASE_PATH_GLOBAL}/scelta_personale`), (snapshot) => {
        const allData = snapshot.val() || {};
        
        // Cerca tutti i container delle risposte
        Object.keys(allData).forEach(id => {
            const container = document.getElementById(`scelta_risposte_${id}`);
            if (!container) return;
            
            const studenti = allData[id];
            if (!studenti || Object.keys(studenti).length === 0) {
                container.innerHTML = 'Ancora nessuna risposta...';
                return;
            }
            
            let html = '';
            Object.keys(studenti).forEach(nome => {
                const risposta = studenti[nome];
                html += `
                <div style="padding: 4px 0; border-bottom: 1px solid #eee;">
                    <b>${nome}:</b> ${risposta.etichetta}
                </div>
                `;
            });
            container.innerHTML = html;
        });
    });
