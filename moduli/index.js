// ================================================================
// INDEX DEI MODULI - Esporta tutti i moduli riutilizzabili
// ================================================================

export { generaIntestazione, initIntestazione } from './intestazione.js';

export {
    generaSceltaPersonale,
    initSceltaPersonale,
    avviaSceltaPersonaleListener,
    setBasePath
} from './sceltaPersonale.js';

export { generaFlashcard } from './flashcard.js';

export {
    generaForum,
    initForum,
    avviaForumListener
} from './forum.js';

export {
    generaLavagna,
    avviaLavagnaListener,
    initLavagna
} from './lavagna.js';

export {
    glossarizzaTesto,
    generaListaGlossario
} from './glossario.js';

export {
    generaSceltaOpzioni,
    initSceltaOpzioni,
    avviaSceltaOpzioniListener
} from './sceltaOpzioni.js';

export {
    generaCreaDomande,
    initCreaDomande,
    avviaCreaDomandeListener
} from './creaDomande.js';

export {
    generaParliamoneInsieme,
    initParliamoneInsieme,
    avviaParliamoneInsiemeListener
} from './parliamoneInsieme.js';

export {
    generaRiordinaDialoghi,
    initRiordinaDialoghi,
    avviaRiordinaDialoghiListener
} from './riordinaDialoghi.js';

export {
    generaCloze,
    initCloze,
    avviaClozeListener
} from './cloze.js';

export {
    generaAssociazione,
    initAssociazione,
    avviaAssociazioneListener
} from './associazione.js';

export {
    generaAutovalutazione,        // ← AGGIUNGI
    initAutovalutazione,          // ← AGGIUNGI
    avviaAutovalutazioneListener  // ← AGGIUNGI
} from './autovalutazione.js';

export {
    initLogin,
    haAccesso,
    getGruppi,
    mostraLogin,
    nascondiLogin,
    getUtenteCorrente,
    logout
} from './login.js';
