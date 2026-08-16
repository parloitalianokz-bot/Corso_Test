// ================================================================
// MODULO: GLOSSARIO
// ================================================================

(function() {
    const css = `
        .glossario-word {
            position: relative;
            color: inherit;
            padding: 0 1px;
            border-bottom: 1px dashed rgba(26, 110, 58, 0.45);
            cursor: help;
            white-space: nowrap;
        }

        .glossario-tooltip {
            position: absolute;
            left: 50%;
            bottom: calc(100% + 8px);
            z-index: 20;
            display: none;
            min-width: 140px;
            max-width: 220px;
            padding: 8px 10px;
            transform: translateX(-50%);
            border: 1px solid rgba(26, 110, 58, 0.18);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.98);
            color: #1f3f2a;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            font-size: 0.92rem;
            font-weight: 400 !important;
            line-height: 1.35;
            text-align: left;
            white-space: normal;
        }

        .glossario-tooltip *,
        .glossario-tooltip-breve {
            font-weight: 400 !important;
        }

        .glossario-tooltip::after {
            position: absolute;
            left: 50%;
            bottom: -6px;
            width: 12px;
            height: 12px;
            transform: translateX(-50%) rotate(45deg);
            border-right: 1px solid rgba(26, 110, 58, 0.18);
            border-bottom: 1px solid rgba(26, 110, 58, 0.18);
            background: rgba(255, 255, 255, 0.98);
            content: '';
        }

        .glossario-word:hover .glossario-tooltip,
        .glossario-word:focus .glossario-tooltip,
        .glossario-word.show-tooltip .glossario-tooltip {
            display: block;
        }

        .glossario-toggle-wrap {
            margin-top: 16px;
        }

        .glossario-toggle-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            background: var(--primary-color, #1a6e3a);
            color: white;
            cursor: pointer;
            font-size: 0.92rem;
            font-weight: 700;
        }

        .glossario-toggle-btn:hover {
            background: var(--secondary-color, #ce2b37);
        }

        .glossario-lista {
            margin-top: 10px;
            padding: 14px 16px;
            border: 1px solid rgba(26, 110, 58, 0.12);
            border-radius: 14px;
            background: #ffffff;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .glossario-lista[hidden] {
            display: none !important;
        }

        .glossario-lista-titolo {
            margin-bottom: 10px;
            color: var(--primary-color, #1a6e3a);
            font-size: 1rem;
            font-weight: 700;
        }

        .glossario-item {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 8px;
            padding: 7px 0;
            border-bottom: 1px solid #edf2ee;
            line-height: 1.45;
        }

        .glossario-item:last-child {
            border-bottom: none;
        }

        .glossario-item-parola {
            color: var(--primary-color, #1a6e3a);
            font-weight: 700;
            white-space: nowrap;
        }

        .glossario-item-resto,
        .glossario-item-pronuncia {
            color: #1a1a1a;
        }

        .glossario-item-pronuncia {
            font-style: italic;
        }

        .glossario-audio-btn {
            padding: 0;
            border: none;
            background: transparent;
            color: var(--primary-color, #1a6e3a);
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 700;
        }

        .glossario-audio-btn:hover {
            color: var(--secondary-color, #ce2b37);
        }

        @media (max-width: 600px) {
            .glossario-lista {
                padding: 12px;
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

function buildTooltip(voce) {
    return `
        <span class="glossario-tooltip">
            <span class="glossario-tooltip-breve">
                ${voce.traduzione_ru || ''}
            </span>
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

export function glossarizzaTesto(testo, glossario = [], tooltip = []) {
    if (!testo) return testo;

    // Se viene fornita una lista tooltip, usa esclusivamente quella.
    // In Unità 001 mantiene il comportamento precedente.
    const voci = tooltip.length
        ? tooltip
        : glossario.filter(voce =>
            SOLO_TOOLTIP.has((voce.parola || '').trim().toLowerCase())
        );

    const vociOrdinate = voci
        .filter(voce => voce?.parola?.trim())
        .sort((a, b) => b.parola.trim().length - a.parola.trim().length);

    let risultato = testo;

    vociOrdinate.forEach(voce => {
        const parola = voce.parola.trim();
        const escaped = escapeRegExp(parola);
        const regex = new RegExp(
            `(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`,
            'giu'
        );

        risultato = risultato.replace(regex, match =>
            `<span class="glossario-word" tabindex="0">${match}${buildTooltip(voce)}</span>`
        );
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
                ${voce.audio
                    ? `<button
                            type="button"
                            class="glossario-audio-btn"
                            onclick="window.playGlossarioAudio('${audioId}')">
                            🔊
                       </button>
                       <audio id="${audioId}" src="${voce.audio}" preload="none"></audio>`
                    : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="glossario-toggle-wrap">
            <button
                type="button"
                class="glossario-toggle-btn"
                onclick="window.toggleGlossario()">
                Mostra glossario
            </button>

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
