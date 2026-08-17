import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { initLogin, getUtenteCorrente, haAccesso, logout, mostraLogin } from './login.js';
import { initIntestazione } from './intestazione.js';
import { avviaForumListener } from './forum.js';

export function avviaUnita({ datiLezione, rendererSchede, moduliDaInizializzare = [], listenerGlobali = [] }) {
    const firebaseConfig = {
        databaseURL: "https://esercizi-parlo-italiano-default-rtdb.europe-west1.firebasedatabase.app/"
    };

    const numUnitaPadded = String(datiLezione.numeroUnita).padStart(3, '0');
    const app = initializeApp(firebaseConfig, `unita${numUnitaPadded}`);
    const database = getDatabase(app);

    initLogin(app);
    moduliDaInizializzare.forEach(fnInit => {
        if (typeof fnInit === 'function') fnInit(app);
    });

    const BASE_PATH = `unita_${numUnitaPadded}`;
    const STORAGE_KEY = `parlo_italiano_${BASE_PATH}_scheda_aperta`;

    const STATO = {
        utente: null,
        isDocente: false,
        schedeInizializzate: {}
    };

    function renderAccordion() {
        const contenitore = document.getElementById('contenitore-schede');
        contenitore.innerHTML = datiLezione.schede.map((scheda, idx) => {
            const numero = idx + 1;
            return `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="window.toggleAccordion('${scheda.id}')">
                        Scheda ${numero}: ${scheda.titolo}
                        <span id="arrow_${scheda.id}">▼</span>
                    </div>
                    <div id="content_${scheda.id}" class="accordion-content">
                        <div id="contenitore_${scheda.id}"></div>
                        <div class="scheda-azioni">
                            <button onclick="window.closeAccordion('${scheda.id}')" class="logout-button">Chiudi scheda</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function inizializzaScheda(idScheda) {
        if (STATO.schedeInizializzate[idScheda]) return;

        const configScheda = datiLezione.schede.find(s => s.id === idScheda);
        if (!configScheda) return;

        const renderer = rendererSchede[configScheda.tipo];
        if (!renderer) {
            console.warn(`[gestioneUnita] Nessun renderer trovato per il tipo: ${configScheda.tipo}`);
            const contenitore = document.getElementById(`contenitore_${idScheda}`);
            if (contenitore) contenitore.innerHTML = `<p class="scheda-istruzioni">Contenuti in preparazione.</p>`;
            return;
        }

        const contenitore = document.getElementById(`contenitore_${idScheda}`);
        if (!contenitore) return;

        // Le schede con dati: null ricevono l'intero datiLezione
        // Le schede con dati: "comprensione" ricevono solo quel sotto-oggetto
        const datiSpecifici = configScheda.dati
            ? datiLezione[configScheda.dati]
            : datiLezione;

        contenitore.innerHTML = renderer.genera(datiSpecifici, STATO);

        if (typeof renderer.avvia === 'function') {
            renderer.avvia(BASE_PATH, datiSpecifici, STATO, database);
        }

        STATO.schedeInizializzate[idScheda] = true;
    }

    function avviaListenerGlobali() {
        listenerGlobali.forEach(config => {
            if (config.tipo === 'forum') {
                avviaForumListener(BASE_PATH, config.id, STATO.isDocente);
            }
        });
    }

    window.toggleAccordion = function(id) {
        const contenuto = document.getElementById(`content_${id}`);
        if (!contenuto) return;

        const eraAperto = contenuto.classList.contains('open');

        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.accordion-header span').forEach(f => f.textContent = '▼');

        if (!eraAperto) {
            contenuto.classList.add('open');
            const freccia = document.getElementById(`arrow_${id}`);
            if (freccia) freccia.textContent = '▲';

            localStorage.setItem(STORAGE_KEY, id);
            inizializzaScheda(id);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    window.closeAccordion = function(id) {
        const contenuto = document.getElementById(`content_${id}`);
        const freccia = document.getElementById(`arrow_${id}`);
        if (contenuto) contenuto.classList.remove('open');
        if (freccia) freccia.textContent = '▼';
        localStorage.removeItem(STORAGE_KEY);
    };

    window.parloLogout = logout;

    function main(utente) {
        if (!utente) {
            mostraLogin(u => main(u));
            return;
        }

        if (!haAccesso(utente, datiLezione.numeroUnita)) {
            alert('Non hai accesso a questa unità!');
            window.location.href = '../../index.html';
            return;
        }

        STATO.utente = utente;
        STATO.isDocente = utente.ruolo === 'docenti';

        initIntestazione({
            ...datiLezione,
            badge: { nome: utente.username, gruppo: utente.gruppo, icona: '👤' }
        });

        renderAccordion();
        avviaListenerGlobali();

        const schedaSalvata = localStorage.getItem(STORAGE_KEY);
        if (schedaSalvata) {
            setTimeout(() => window.toggleAccordion(schedaSalvata), 150);
        }
    }

    main(getUtenteCorrente());
}
