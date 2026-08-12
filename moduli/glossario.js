// ================================================================
// MODULO: GLOSSARIO INTERATTIVO
// ================================================================
// Trasforma le parole del glossario in span interattivi con tooltip
// ================================================================

(function() {
    const css = `
        .glossario-word {
            position: relative;
            cursor: pointer;
        }

        .glossario-tooltip {
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            width: max-content;
            max-width: 280px;
            background: #ffffff;
            color: #333;
            border: 1px solid #1a6e3a;
            border-radius: 6px;
            box-shadow: 0 6px 16px rgba(26, 110, 58, 0.2);
            padding: 10px 14px;
            z-index: 20;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 0.95rem;
            line-height: 1.5;
            text-align: left;
            pointer-events: none;
            white-space: normal;
        }

        /* Freccia verso l'alto */
        .glossario-tooltip::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent #1a6e3a transparent;
        }

        .glossario-tooltip::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #ffffff transparent;
            margin-bottom: -1px;
        }

        .glossario-word:hover .glossario-tooltip,
        .glossario-word:active .glossario-tooltip {
            display: block;
        }

        .glossario-tooltip-traduzione {
            color: #1a6e3a;
            font-weight: 600;
        }

        .glossario-lista {
            margin-top: 16px;
            padding: 16px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid rgba(26, 110, 58, 0.12);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .glossario-lista-titolo {
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 12px;
            font-size: 1rem;
        }

        .glossario-item {
            display: flex;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #edf2ee;
        }

        .glossario-item:last-child {
            border-bottom: none;
        }

        .glossario-item-parola {
            min-width: 120px;
            font-weight: 700;
            color: #1f3f2a;
        }

        .glossario-item-note {
            color: #3d3226;
            font-size: 0.95rem;
            line-height: 1.45;
        }

        .glossario-toggle {
            margin-top: 12px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 999px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 700;
        }

        .glossario-toggle:hover {
            background: #145a30;
        }

        .glossario-nascosto {
            display: none;
        }

        @media (max-width: 600px) {
            .glossario-tooltip {
                max-width: 220px;
            }
            .glossario-item {
                flex-direction: column;
                gap: 4px;
            }
            .glossario-item-parola {
                min-width: 0;
            }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

/**
 * Trasforma un testo HTML inserendo span glossariati per le voci del glossario.
 * - Case-insensitive
 * - Supporta chunk multi-parola ("molte camere")
 * - Glossarizza solo la PRIMA occorrenza di ogni voce
 * 
 * @param {string} testo - Il testo HTML da glossarizzare
 * @param {Array} glossario - Array di oggetti {parola, traduzione_ru, pronuncia_ru}
 * @returns {string} Testo HTML con le parole glossarizzate
 */
export function glossarizzaTesto(testo, glossario) {
    if (!glossario || glossario.length === 0) return testo;
    
    // Ordina per lunghezza decrescente
    const vociOrdinate = glossario.slice().sort((a, b) => 
        (b.parola?.length || 0) - (a.parola?.length || 0)
    );
    
    let risultato = testo;
    
    vociOrdinate.forEach((voce) => {
        const parola = voce.parola || '';
        if (!parola) return;
        
        const escaped = parola.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // 🔑 CAMBIA: usa 'gi' per globale + case-insensitive
        const regex = new RegExp(
            `(?<=^|[^A-Za-zÀ-ÿ0-9])(${escaped})(?=[^A-Za-zÀ-ÿ0-9]|$)`,
            'gi'  // ← 'g' per trovare TUTTE le occorrenze
        );
        
        const tooltipHtml = `
            <span class="glossario-tooltip" role="tooltip">
                ${voce.traduzione_ru ? `<span class="glossario-tooltip-traduzione">${voce.traduzione_ru}</span>` : ''}
            </span>
        `;
        
        // 🔑 CAMBIA: usa replaceAll per sostituire TUTTE le occorrenze
        risultato = risultato.replaceAll(regex, (match) => {
            // Evita di glossarizzare parole già dentro tag HTML
            const startIndex = risultato.indexOf(match);
            const before = risultato[startIndex - 1] || '';
            const after = risultato[startIndex + match.length] || '';
            if (before === '<' || after === '>') return match;
            
            return `<span class="glossario-word" data-glossario-word="${parola}">${match}${tooltipHtml}</span>`;
        });
    });
    
    return risultato;
}
