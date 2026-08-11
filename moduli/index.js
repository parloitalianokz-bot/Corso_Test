// ================================================================
// INDEX DEI MODULI - Esporta tutti i moduli riutilizzabili
// ================================================================

// 📦 Modulo: Intestazione
export { generaIntestazione, initIntestazione } from './intestazione.js';

// 📦 Modulo: Scelta Personale
export { 
    generaSceltaPersonale, 
    initSceltaPersonale, 
    avviaSceltaPersonaleListener,
    setBasePath 
} from './sceltaPersonale.js';

// 📦 Modulo: Flashcard
export { generaFlashcard } from './flashcard.js';

// 📦 Modulo: Login
export { 
    initLogin, 
    haAccesso, 
    getGruppi,
    mostraLogin, 
    nascondiLogin, 
    getUtenteCorrente, 
    logout 
} from './login.js';
