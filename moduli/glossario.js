// ================================================================
// MODULO: GLOSSARIO
// ================================================================
// Evidenzia le parole del glossario nel testo e genera tooltip + lista finale
// ================================================================

(function() {
    const css = `
        .glossario-word {
            color: inherit;
            border-bottom: 1px dashed rgba(26, 110, 58, 0.45);
            padding: 0 1px;
            cursor: help;
            position: relative;
            white-space: nowrap;
        }

        .glossario-tooltip {
            position: absolute;
            left: 50%;
            bottom: calc(100% + 8px);
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.98);
            color: #1f3f2a;
            border: 1px solid rgba(26, 110, 58, 0.18);
            border-radius: 10px;
            padding: 8px 10px;
            min-width: 140px;
            max-width: 220px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            z-index: 20;
            display: none;
            font-size: 0.92rem;
            line-height: 1.35;
            text-align: left;
        }

        .glossario-tooltip::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -6px;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.98);
            border-right: 1px solid rgba(26, 110, 58, 0.18);
            border-bottom: 1px solid rgba(26, 110, 58, 0.18);
        }

        .glossario-word:hover .glossario-tooltip,
        .glossario-word:focus .glossario-tooltip,
        .glossario-word.show-tooltip .glossario-tooltip {
            display: block;
        }

        .glossario-tooltip-breve {
            font-weight: 600;
        }

        .glossario-toggle-wrap {
            margin-top: 16px;
        }

        .glossario-toggle-btn {
            background: var(--primary-color, #1a6e3a);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 700;
            font-size: 0.92rem;
        }

        .glossario-toggle-btn:hover {
            background: var(--secondary-color, #ce2b37);
        }

        .glossario-lista {
            margin-top: 10px;
            padding: 14px 16px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid rgba(26, 110, 58, 0.12);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .glossario-lista[hidden] {
            display: none !important;
        }

        .glossario-lista-titolo {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 10px;
            font-size: 1rem;
        }

        .glossario-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 7px 0;
            border-bottom: 1px solid #edf2ee;
            line-height: 1.45;
            flex-wrap: wrap;
        }

        .glossario-item:last-child {
            border-bottom: none;
        }

        .glossario-item-parola {
            font-weight: 700;
            color: var(--primary-color, #1a6e3a);
            white-space: nowrap;
        }

        .glossario-item-resto {
            color: #1a1a1a;
        }

        .glossario-item-pronuncia {
            color: #1a1a1a;
            font-style: italic;
        }

        .glossario-audio-btn {
            border: none;
            background: transparent;
            color: var(--primary-color, #1a6e3a);
            cursor: pointer;
            font-weight: 700;
            padding: 0;
            font-size: 0.95rem;
        }

        .glossario-audio-btn:hover {
            color: var(--secondary-color, #ce2b37);
        }

        @media (max-width: 600px) {
            .glossario-lista {
                padding: 12px 12px;
            }

            .glossario-item {
                gap: 6px;
            }

            .glossario-tooltip {
                min-width: 120px;
                max-width: 180px;
                font-size: 0.85rem;
            }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isInsideTag(html, index) {
    const lastOpen = html.lastIndexOf('<', index);
    const lastClose = html.lastIndexOf('>', index);
    return lastOpen > lastClose;
}

function buildTooltip(voce) {
    const traduzione = voce.traduzione_ru || '';
    return `
        <span class="glossario-tooltip">
            <span class="glossario-tooltip-breve">${traduzione}</span>
        </span>
    `;
}

const SOLO_TOOLTIP = new Set([
    'comodo',
    'camere',
    'stranieri',
    'per affari',
    'tedeschi',
    'insegnante',
    'sposato',
    'occupato'
]);

export function glossarizzaTesto(testo, glossario) {
    if (!testo || !glossario || glossario.length === 0) return testo;

    const vociOrdinate = glossario
        .filter(voce => SOLO_TOOLTIP.has((voce.parola || '').trim()))
        .slice()
        .sort((a, b) => (b.parola?.length || 0) - (a.parola?.length || 0));

    let risultato = testo;

    vociOrdinate.forEach((voce) => {
        const parola = (voce.parola || '').trim();
        if (!parola) return;

        const escaped = escapeRegExp(parola);
        const regex = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, 'giu');

        risultato = risultato.replace(regex, (match, p1, offset) => {
            if (isInsideTag(risultato, offset)) return match;
            return `<span class="glossario-word" tabindex="0">${match}${buildTooltip(voce)}</span>`;
        });
    });

    return risultato;
}

export function generaListaGlossario(glossario) {
    if (!glossario || glossario.length === 0) return '';

    const items = glossario.map((voce, index) => {
        const audioId = `glossario_audio_${index}`;
        const parola = voce.parola || '';
        const traduzione = voce.traduzione_ru || '';
        const pronuncia = voce.pronuncia_ru || '';

        return `
            <div class="glossario-item">
                <span class="glossario-item-parola">${parola}</span>
                <span class="glossario-item-resto">: ${traduzione} (${pronuncia})</span>
                ${voce.audio ? `<button type="button" class="glossario-audio-btn" onclick="window.playGlossarioAudio('${audioId}')">🔊</button><audio id="${audioId}" src="${voce.audio}" preload="none"></audio>` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="glossario-toggle-wrap">
            <button type="button" class="glossario-toggle-btn" onclick="window.toggleGlossario()">Mostra glossario</button>
            <div class="glossario-lista" id="glossario_lista" hidden>
                <div class="glossario-lista-titolo">📚 Glossario</div>
                ${items}
            </div>
        </div>
    `;
}

window.toggleGlossario = function() {
    const lista = document.getElementById('glossario_lista');
    const btn = document.querySelector('.glossario-toggle-btn');
    if (!lista || !btn) return;

    const nascosto = lista.hasAttribute('hidden');
    if (nascosto) {
        lista.removeAttribute('hidden');
        btn.textContent = 'Nascondi glossario';
    } else {
        lista.setAttribute('hidden', 'hidden');
        btn.textContent = 'Mostra glossario';
    }
};

window.playGlossarioAudio = function(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
};
