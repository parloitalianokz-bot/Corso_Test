// ================================================================
// MODULO: SCELTA PERSONALE
// ================================================================

// INIETTA CSS SPECIFICO DEL MODULO
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
        
        /* Tablet */
        @media (max-width: 1024px) and (min-width: 601px) {
            .scelta-opzioni { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
        
        /* Smartphone */
        @media (max-width: 600px) {
            .scelta-opzioni { grid-template-columns: 1fr; gap: 15px; max-width: 300px; margin: 15px auto; }
            .scelta-immagine { max-width: 200px; margin: 0 auto; }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎨 CSS SceltaPersonale iniettato');
})();

// ================================================================
// FUNZIONI DEL MODULO
// ================================================================

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function escapeJsString(str) {
    return String(str).replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

export function generaSceltaPersonale(config, isDocente) {
    const data = config?.elicitazione?.sceltaPersonale;
    if (!data) return '';
    
    const id = data.idFirebase || 'scelta_personale';
    
    let opzioniHtml = '';
    (data.opzioni || []).forEach((opt) => {
        const safeId = escapeJsString(opt.id);
        const safeLabel = escapeJsString(opt.etichetta);
        opzioniHtml += `
        <div class="scelta-option" onclick="scegliOpzione('${id}', '${safeId}', '${safeLabel}')">
            <img src="${opt.img}" alt="${escapeHtml(opt.etichetta)}" class="scelta-immagine" id="img_${id}_${opt.id}">
            <div class="scelta-etichetta">${escapeHtml(opt.etichetta)}</div>
        </div>
        `;
    });
    
    return `
    <div class="scelta-container">
        <div class="scelta-domanda">${escapeHtml(data.domanda)}</div>
        <div class="scelta-opzioni">${opzioniHtml}</div>
        <div class="scelta-risposta">
            <div class="scelta-frase-base">${escapeHtml(data.fraseBase)}</div>
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
// FUNZIONE GLOBALE PER LA SCELTA
// ================================================================
window.scegliOpzione = function(id, opzioneId, etichetta) {
    console.log('🔍 sceltaPersonale: opzione selezionata', opzioneId, etichetta);
    
    const selectedImg = document.getElementById('img_' + id + '_' + opzioneId);
    if (selectedImg) {
        selectedImg.style.borderColor = 'var(--primary-color)';
        selectedImg.style.borderWidth = '4px';
        selectedImg.style.boxShadow = '0 0 20px rgba(26, 110, 58, 0.3)';
    }
    
    document.querySelectorAll('.scelta-immagine').forEach(function(img) {
        if (img.id !== 'img_' + id + '_' + opzioneId) {
            img.style.borderColor = '#ddd';
            img.style.borderWidth = '2px';
            img.style.boxShadow = 'none';
        }
    });
    
    const testoEl = document.getElementById('scelta_testo_' + id);
    if (testoEl) {
        testoEl.innerHTML = '<strong>' + escapeHtml(etichetta) + '</strong>';
        testoEl.style.color = 'var(--primary-color)';
        testoEl.style.fontStyle = 'normal';
    }
    
    const bacheca = document.getElementById('scelta_risposte_' + id);
    if (bacheca) {
        bacheca.innerHTML = '<div style="padding:8px;background:#d4edda;border-radius:4px;color:#155724;">✅ Hai scelto: <strong>' + escapeHtml(etichetta) + '</strong> (salvataggio simulato)</div>';
    }
};