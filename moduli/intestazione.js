// ================================================================
// MODULO: INTESTAZIONE DELLA LEZIONE
// ================================================================
// Gestisce titolo, sottotitolo, banner e badge utente.
// ================================================================

// ================================================================
// 1. INIETTA CSS
// ================================================================

(function() {
    const css = `
        /* ==========================================================
           MODULO: INTESTAZIONE DELLA LEZIONE
           ========================================================== */
        
        .intestazione-container {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid var(--primary-color, #1a6e3a);
            position: relative;
        }
        
        /* Badge utente */
        .intestazione-badge {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .intestazione-nome {
            color: var(--primary-color, #1a6e3a);
            font-weight: 700;
        }
        
        .intestazione-gruppo {
            color: var(--secondary-color, #ce2b37);
            font-weight: 700;
        }
        
        .intestazione-separatore {
            margin: 0 8px;
            color: #bdc3c7;
        }
        
        /* Titolo */
        .intestazione-titolo {
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 5px;
            font-size: 2.2rem;
            letter-spacing: -0.5px;
        }
        
        /* Sottotitolo */
        .intestazione-sottotitolo {
            font-style: italic;
            color: #7f8c8d;
            font-size: 1.1rem;
            margin: 0;
        }
        
        /* Banner */
        .intestazione-banner {
            text-align: center;
            margin: 15px 0 0 0;
        }
        
        .intestazione-banner-img {
            width: 100%;
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            display: inline-block;
        }
        
        /* Linea decorativa sotto il titolo */
        .intestazione-container::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: var(--secondary-color, #ce2b37);
            border-radius: 3px;
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 600px) {
            .intestazione-titolo {
                font-size: 1.6rem;
            }
            
            .intestazione-sottotitolo {
                font-size: 0.95rem;
            }
            
            .intestazione-badge {
                font-size: 0.75rem;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎨 CSS Intestazione iniettato');
})();

// ================================================================
// 2. FUNZIONE PER GENERARE L'HTML
// ================================================================

export function generaIntestazione(config) {
    if (!config) return "";
    
    const titolo = config.titolo || "Lezione Interattiva";
    const sottotitolo = config.sottotitolo || "";
    const bannerImg = config.bannerImg || "";
    
    // Badge utente (dati fissi per test)
    const badge = config.badge || { nome: "Antonio", gruppo: "Venezia", icona: "👤" };
    
    return `
    <div class="intestazione-container">
        <!-- Badge utente -->
        <div class="intestazione-badge">
            ${badge.icona} <span class="intestazione-nome">${badge.nome}</span>
            <span class="intestazione-separatore">·</span>
            🏫 <span class="intestazione-gruppo">${badge.gruppo}</span>
        </div>
        
        <!-- Titolo -->
        <h1 class="intestazione-titolo">${titolo}</h1>
        
        <!-- Sottotitolo -->
        ${sottotitolo ? `<p class="intestazione-sottotitolo">${sottotitolo}</p>` : ''}
        
        <!-- Banner -->
        ${bannerImg ? `
            <div class="intestazione-banner">
                <img src="${bannerImg}" alt="${titolo}" class="intestazione-banner-img">
            </div>
        ` : ''}
    </div>
    `;
}

// ================================================================
// 3. FUNZIONE PER INIZIALIZZARE NEL DOM
// ================================================================

export function initIntestazione(config) {
    const container = document.getElementById('intestazione-container');
    if (!container) {
        console.warn('⚠️ Container intestazione non trovato!');
        return;
    }
    
    container.innerHTML = generaIntestazione(config);
}