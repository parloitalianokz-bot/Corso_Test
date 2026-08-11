// ================================================================
// MODULO: FLASHCARD
// ================================================================

(function() {
    const css = `
        .flashcard-wrapper {
            position: relative;
            width: 100%;
            margin: 20px 0;
            padding: 0 42px;
            box-sizing: border-box;
        }

        .flashcard-slider {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 10px 0;
        }

        .flashcard-slider::-webkit-scrollbar {
            display: none;
        }

        .flashcard-item {
            flex: 0 0 auto;
            width: 180px;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            border: 2px solid transparent;
        }

        .flashcard-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.14);
            border-color: var(--primary-color, #1a6e3a);
        }

        .flashcard-image {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            display: block;
            background: #f4f4f4;
        }

        .flashcard-label {
            padding: 10px 8px 12px;
            text-align: center;
            font-weight: 700;
            color: var(--text-color, #1a1a2e);
            font-size: 0.95rem;
            line-height: 1.25;
        }

        .flashcard-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: var(--primary-color, #1a6e3a);
            color: white;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            transition: transform 0.2s ease, background 0.2s ease;
        }

        .flashcard-arrow:hover {
            background: var(--secondary-color, #ce2b37);
            transform: translateY(-50%) scale(1.08);
        }

        .flashcard-arrow.prev { left: 0; }
        .flashcard-arrow.next { right: 0; }

        .flashcard-hint {
            text-align: center;
            color: #7f8c8d;
            font-size: 0.85rem;
            margin-top: 8px;
        }

        @media (max-width: 900px) {
            .flashcard-wrapper {
                padding: 0 34px;
            }

            .flashcard-item {
                width: 150px;
            }
        }

        @media (max-width: 600px) {
            .flashcard-wrapper {
                padding: 0 28px;
            }

            .flashcard-item {
                width: 125px;
            }

            .flashcard-label {
                font-size: 0.82rem;
                padding: 8px 6px 10px;
            }

            .flashcard-arrow {
                width: 30px;
                height: 30px;
                font-size: 1rem;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

export function generaFlashcard(vocabolario, id = 'flashcard') {
    if (!vocabolario || vocabolario.length === 0) return '';

    const sliderId = `flashcard-slider-${id}`;

    let html = `
    <div class="flashcard-wrapper">
        <button type="button" class="flashcard-arrow prev" onclick="window.scrollFlashcard('${sliderId}', -1)">❮</button>
        <div id="${sliderId}" class="flashcard-slider">
    `;

    vocabolario.forEach((item, index) => {
        const audioId = `audio_${id}_${index}`;
        html += `
            <div class="flashcard-item" onclick="window.playFlashcardAudio('${audioId}')">
                <img class="flashcard-image" src="${item.img}" alt="${item.parola}" loading="lazy">
                <div class="flashcard-label">${item.parola}</div>
                <audio id="${audioId}" src="${item.audio}" preload="none"></audio>
            </div>
        `;
    });

    html += `
        </div>
        <button type="button" class="flashcard-arrow next" onclick="window.scrollFlashcard('${sliderId}', 1)">❯</button>
    </div>
    <p class="flashcard-hint">Usa le frecce o scorri lateralmente</p>
    `;

    return html;
}

window.scrollFlashcard = function(sliderId, direction) {
    const container = document.getElementById(sliderId);
    if (!container) return;

    const item = container.querySelector('.flashcard-item');
    if (!item) return;

    const gap = 16;
    const amount = item.offsetWidth + gap;
    container.scrollBy({ left: amount * direction, behavior: 'smooth' });
};

window.playFlashcardAudio = function(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
};