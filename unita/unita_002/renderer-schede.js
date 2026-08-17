import {
    initSceltaPersonale,
    initForum,
    initLavagna,
    initSceltaOpzioni,
    initCreaDomande,
    initParliamoneInsieme,
    generaSceltaPersonale,
    avviaSceltaPersonaleListener,
    generaFlashcard,
    generaForum,
    generaLavagna,
    avviaLavagnaListener,
    glossarizzaTesto,
    generaListaGlossario,
    generaSceltaOpzioni,
    avviaSceltaOpzioniListener,
    generaCreaDomande,
    avviaCreaDomandeListener,
    generaParliamoneInsieme,
    avviaParliamoneInsiemeListener
} from '../../moduli/index.js';

export const moduliDaInizializzare = [
    initSceltaPersonale,
    initForum,
    initLavagna,
    initSceltaOpzioni,
    initCreaDomande,
    initParliamoneInsieme
];

export const listenerGlobali = [
    { tipo: 'forum', id: 'u002_ascolto_comprensione' },
    { tipo: 'forum', id: 'u002_mangiare_quando_ho_fame' },
    { tipo: 'forum', id: 'u002_bere_quando_ha_sete' }
];

// Helper: avvia lavagna solo quando l'elemento esiste nel DOM (max 10 tentativi)
function avviaLavagnaQuandoPronta(basePath, idLavagna, isDocente, username, tentativi = 0) {
    const el = document.getElementById(`board_${idLavagna}`);
    if (el) {
        avviaLavagnaListener(basePath, idLavagna, isDocente, username, `${username}_${Date.now()}`);
    } else if (tentativi < 10) {
        setTimeout(() => {
            avviaLavagnaQuandoPronta(basePath, idLavagna, isDocente, username, tentativi + 1);
        }, 100);
    } else {
        console.warn(`[Lavagna] Impossibile trovare board_${idLavagna} nel DOM dopo 10 tentativi.`);
    }
}

function preparaDatiSceltaPersonale(datiLezione) {
    const scheda = datiLezione?.scheda_1;
    const scelta = scheda?.sceltaPersonale;
    if (!scelta) return null;
    return {
        elicitazione: {
            sceltaPersonale: {
                domanda: scelta.titolo || scheda.istruzioni || '',
                fraseBase: scelta.fraseBase || 'Io sono...',
                fraseClasse: scelta.fraseClasse || '{nome}: {etichetta}',
                idFirebase: scelta.idFirebase || 'u002_scelta_personale',
                opzioni: (scelta.opzioni || []).map(opzione => ({
                    id: opzione.id || opzione.valore,
                    etichetta: opzione.etichetta || opzione.testo,
                    img: opzione.img || ''
                }))
            }
        }
    };
}

function generaParteAttivita2(parte, idFlashcard) {
    if (!parte) return '';
    return `
        <div class="section-separator">
            <p class="scheda-domanda">${parte.domanda || ''}</p>
            <p class="scheda-istruzioni">${parte.istruzioni || ''}</p>
            ${parte.vocabolario?.length
                ? generaFlashcard(parte.vocabolario, idFlashcard)
                : ''}
            ${parte.forum
                ? generaForum({ forum: parte.forum })
                : ''}
        </div>
    `;
}

function renderScheda1(datiLezione, STATO) {
    if (!datiLezione) return '';
    const scheda = datiLezione.scheda_1;
    if (!scheda) return '';

    const scelta = preparaDatiSceltaPersonale(datiLezione);
    const attivita2 = scheda.attivita_2;

    return `
        <div class="section-separator section-separator-no-top">
            ${scheda.immaginePrincipale ? `
                <div class="scheda-immagine-box">
                    <img
                        src="${scheda.immaginePrincipale}"
                        alt="${scheda.titolo || 'Attività introduttiva'}"
                        class="scheda-immagine scheda-immagine-centrata">
                </div>
            ` : ''}

            <div class="attivita-label">${scheda.titolo || ''}</div>
            <p class="scheda-istruzioni">${scheda.istruzioni || ''}</p>

            ${scelta ? `
                <div id="contenitore-scelta-personale">
                    ${generaSceltaPersonale(scelta, STATO.isDocente)}
                </div>
            ` : ''}

            ${attivita2 ? `
                <div class="section-separator">
                    <div class="attivita-label">${attivita2.titolo || ''}</div>
                    ${generaParteAttivita2(attivita2.cibi, 'u002_cibi')}
                    ${generaParteAttivita2(attivita2.bevande, 'u002_bevande')}
                </div>
            ` : ''}

            ${scheda.attivita_3 ? `
                <div class="section-separator">
                    <div class="attivita-label">${scheda.attivita_3.titolo || ''}</div>
                    <p class="scheda-istruzioni">${scheda.attivita_3.istruzioni || ''}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function renderScheda2(datiLezione, STATO) {
    if (!datiLezione) return '';
    return `
        <div class="scheda-video-box">
            <div class="attivita-label">Attività 1 - Guardate e ascoltate il video</div>
            <p class="scheda-istruzioni">
                Guardate il video e ascoltate con attenzione.
            </p>

            <div class="video-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/6kl8KZftC_A?rel=0"
                    title="Video di ascolto dell'Unità 002"
                    allowfullscreen>
                </iframe>
            </div>

            <div class="section-separator">
                ${generaLavagna({
                    id: 'u002_ascolto_scanning',
                    placeholder: 'Scrivete le parole che riconoscete...',
                    titolo: 'Attività 2 - Caccia alle parole'
                })}
            </div>

            <div class="section-separator">
                ${generaForum({
                    forum: {
                        idFirebase: 'u002_ascolto_comprensione',
                        domanda: 'Attività 3 - Mettiti alla prova: scrivi cosa ricordi',
                        placeholder: 'Scrivi qui ciò che hai capito...'
                    }
                })}
            </div>
        </div>
    `;
}

function renderScheda3(datiLezione, STATO) {
    if (!datiLezione) return '';
    const scheda = datiLezione.scheda_3;
    if (!scheda) return '';

    const paragrafi = (scheda.paragrafi || [])
        .map(paragrafo => `
            <p class="lettura-paragrafo">
                ${glossarizzaTesto(
                    paragrafo,
                    scheda.glossario || [],
                    scheda.tooltip || []
                )}
            </p>
        `)
        .join('');

    return `
        <div class="scheda-lettura-box">
            <h3 class="scheda-lettura-titolo">${scheda.titolo || ''}</h3>
            <div class="scheda-lettura-pagina">${paragrafi}</div>
            ${generaListaGlossario(scheda.glossario || [])}

            ${scheda.brainstorming ? `
                <div class="section-separator">
                    ${generaLavagna({
                        id: scheda.brainstorming.id,
                        placeholder: scheda.brainstorming.placeholder,
                        titolo: scheda.brainstorming.titolo
                    })}
                </div>
            ` : ''}
        </div>
    `;
}

function renderScheda4(datiLezione, STATO) {
    return datiLezione?.comprensione
        ? generaSceltaOpzioni(datiLezione.comprensione, STATO.isDocente)
        : '';
}

function renderScheda5(datiLezione, STATO) {
    return datiLezione?.produzioneDomande
        ? generaCreaDomande(datiLezione.produzioneDomande, STATO.isDocente)
        : '';
}

function renderScheda6(datiLezione, STATO) {
    return datiLezione?.produzioneRisposte
        ? generaParliamoneInsieme(datiLezione.produzioneRisposte, STATO.isDocente)
        : '';
}

export const rendererSchede = {
    scheda1: {
        genera: (dati, STATO) => renderScheda1(dati, STATO),
        avvia: (basePath, dati, STATO) => {
            avviaSceltaPersonaleListener(basePath, STATO.utente.username, STATO.isDocente);
        }
    },
    scheda2: {
        genera: (dati, STATO) => renderScheda2(dati, STATO),
        avvia: (basePath, dati, STATO) => {
            if (STATO.utente) {
                avviaLavagnaQuandoPronta(basePath, 'u002_ascolto_scanning', STATO.isDocente, STATO.utente.username);
            }
        }
    },
    scheda3: {
        genera: (dati, STATO) => renderScheda3(dati, STATO),
        avvia: (basePath, dati, STATO) => {
            const id = dati?.scheda_3?.brainstorming?.id;
            if (id && STATO.utente) {
                avviaLavagnaQuandoPronta(basePath, id, STATO.isDocente, STATO.utente.username);
            }
        }
    },
    sceltaOpzioni: {
        genera: (dati, STATO) => dati ? generaSceltaOpzioni(dati, STATO.isDocente) : '',
        avvia: (basePath, dati, STATO) => {
            if (dati?.domande?.length) {
                avviaSceltaOpzioniListener(basePath, dati.domande, STATO.isDocente, STATO.utente.username);
            }
        }
    },
    creaDomande: {
        genera: (dati, STATO) => dati ? generaCreaDomande(dati, STATO.isDocente) : '',
        avvia: (basePath, dati, STATO) => {
            if (dati?.esercizi?.length) {
                avviaCreaDomandeListener(basePath, dati.esercizi, STATO.isDocente, STATO.utente.username);
            }
        }
    },
    parliamoneInsieme: {
        genera: (dati, STATO) => dati ? generaParliamoneInsieme(dati, STATO.isDocente) : '',
        avvia: (basePath, dati, STATO) => {
            if (dati?.esercizi?.length) {
                avviaParliamoneInsiemeListener(basePath, dati.esercizi, STATO.isDocente, STATO.utente.username);
            }
        }
    }
};
