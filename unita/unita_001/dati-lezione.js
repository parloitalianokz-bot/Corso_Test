// ================================================================
// DATI DELLA LEZIONE - Unità 001: Motivazione e Presentazioni
// ================================================================

export const datiLezione = {
    // ============================================================
    // INTESTAZIONE
    // ============================================================
    titolo: "Unità 1 - Un albergo in centro",
    sottotitolo: "Livello A1 - Iniziamo a viaggiare",
    bannerImg: "img/banner_unita1.webp",

    // ============================================================
    // SCHEDA 1: ELICITAZIONE
    // ============================================================
    elicitazione: {
        sceltaPersonale: {
            domanda: '📌 Perché studi l\'italiano?',
            fraseBase: 'Io studio l\'italiano...',
            idFirebase: 'unita_001_motivazione',
            opzioni: [
                { id: 'turismo', etichetta: 'per turismo', img: 'img/motivazioni/turismo.webp' },
                { id: 'studio', etichetta: 'per studio', img: 'img/motivazioni/studio.webp' },
                { id: 'amore', etichetta: 'per amore', img: 'img/motivazioni/amore.webp' },
                { id: 'lavoro', etichetta: 'per lavoro', img: 'img/motivazioni/lavoro.webp' }
            ]
        }
    },

    // ============================================================
    // SCHEDA 1: VOCABOLARIO (Flashcard)
    // ============================================================
    vocabolario: [
        { parola: "La pizza", audio: "audio/italia/pizza.mp3", img: "img/italia/pizza.webp" },
        { parola: "La pasta", audio: "audio/italia/pasta.mp3", img: "img/italia/pasta.webp" },
        { parola: "Il gelato", audio: "audio/italia/gelato.mp3", img: "img/italia/gelato.webp" },
        { parola: "Il caffè", audio: "audio/italia/caffe.mp3", img: "img/italia/caffe.webp" },
        { parola: "Il Colosseo", audio: "audio/italia/colosseo.mp3", img: "img/italia/colosseo.webp" },
        { parola: "La moda", audio: "audio/italia/moda.mp3", img: "img/italia/moda.webp" },
        { parola: "La Ferrari", audio: "audio/italia/ferrari.mp3", img: "img/italia/ferrari.webp" },
        { parola: "Il calcio", audio: "audio/italia/calcio.mp3", img: "img/italia/calcio.webp" }
    ],

    // ============================================================
    // SCHEDA 1: FORUM
    // ============================================================
    forum: {
        idFirebase: 'unita001_forum_parole',
        domanda: '🇮🇹 Che altre parole italiane conosci?',
        placeholder: 'Scrivi una parola italiana...',
        mostraNumeroParole: true
    },

    // ============================================================
    // SCHEDA 2: ASCOLTO
    // ============================================================
    ascolto: {
        videoUrl: '5FpbKA_i074',
        istruzioni: 'Guarda il video e ascolta attentamente la pronuncia.',
        scanning: {
            id: 'u001_ascolto_scanning',
            placeholder: 'Scrivi qui le parole che hai sentito...',
            titolo: 'Caccia alle parole'
        },
        comprensione: {
            id: 'u001_ascolto_comprensione',
            domanda: 'Attività 3 - Mettiti alla prova, scrivi cosa ricordi',
            placeholder: 'Nel video si parla di...'
        }
    },

    // ============================================================
    // SCHEDA 3: LETTURA
    // ============================================================
    lettura: {
        titolo: 'Un albergo in centro',
        sfondo: 'img/sfondo_pagina_libro.webp',
        brainstorming: {
            id: 'u001_lettura_brainstorming',
            titolo: '✍️ Vocabolario: Quali parole nuove hai trovato?',
            placeholder: 'Scrivi qui le parole nuove che hai trovato...'
        },
        glossario: [
            { parola: 'albergo', traduzione_ru: 'гостиница', pronuncia_ru: 'альберго', audio: 'audio/glossario/albergo.mp3' },
            { parola: 'comodo', traduzione_ru: 'удобный', pronuncia_ru: 'комодо', audio: 'audio/glossario/comodo.mp3' },
            { parola: 'camere', traduzione_ru: 'комнаты', pronuncia_ru: 'камере', audio: 'audio/glossario/camere.mp3' },
            { parola: 'stranieri', traduzione_ru: 'иностранцы', pronuncia_ru: 'страниери', audio: 'audio/glossario/stranieri.mp3' },
            { parola: 'ospiti', traduzione_ru: 'гости', pronuncia_ru: 'оспити', audio: 'audio/glossario/ospiti.mp3' },
            { parola: 'centro', traduzione_ru: 'центр', pronuncia_ru: 'чентро', audio: 'audio/glossario/centro.mp3' },
            { parola: 'per affari', traduzione_ru: 'по делам', pronuncia_ru: 'пер аффари', audio: 'audio/glossario/per-affari.mp3' },
            { parola: 'anche', traduzione_ru: 'тоже / также', pronuncia_ru: 'анке', audio: 'audio/glossario/anche.mp3' },
            { parola: 'tedeschi', traduzione_ru: 'немцы', pronuncia_ru: 'тедески', audio: 'audio/glossario/tedeschi.mp3' },
            { parola: 'francese', traduzione_ru: 'французский', pronuncia_ru: 'франчезе', audio: 'audio/glossario/francese.mp3' },
            { parola: 'avvocato', traduzione_ru: 'адвокат', pronuncia_ru: 'аввокато', audio: 'audio/glossario/avvocato.mp3' },
            { parola: 'insegnante', traduzione_ru: 'преподаватель', pronuncia_ru: 'инсеньянте', audio: 'audio/glossario/insegnante.mp3' },
            { parola: 'sposato', traduzione_ru: 'женат', pronuncia_ru: 'спозато', audio: 'audio/glossario/sposato.mp3' },
            { parola: 'figli', traduzione_ru: 'дети', pronuncia_ru: 'фильи', audio: 'audio/glossario/figli.mp3' },
            { parola: 'occupato', traduzione_ru: 'занят', pronuncia_ru: 'окупато', audio: 'audio/glossario/occupato.mp3' }
        ],
        paragrafi: [
            'L\'albergo "Ponte Vecchio" <strong>è</strong> a Firenze, in Italia. <strong>È</strong> un albergo grande, con molte camere. <strong>È</strong> un albergo comodo per gli stranieri, perché <strong>è</strong> in centro.',
            'Chi <strong>sono</strong> gli ospiti dell\'albergo "Ponte Vecchio" in questo momento?',
            'Victor <strong>è</strong> un cliente dell\'albergo. Victor <strong>è</strong> francese; <strong>è</strong> avvocato. Adesso <strong>è</strong> in Italia per affari.',
            'Anche Klaus e Karl <strong>sono</strong> clienti dell\'albergo. <strong>Sono</strong> tedeschi e <strong>sono</strong> studenti. <strong>Sono</strong> in Italia per studiare l\'italiano.',
            'Mary <strong>è</strong> inglese; <strong>è</strong> insegnante, ed <strong>è</strong> in Italia per insegnare l\'inglese. Yoko, invece, <strong>è</strong> giapponese; <strong>è</strong> dentista ed <strong>è</strong> in Italia per una conferenza.',
            'Olga <strong>è</strong> russa. <strong>È</strong> studentessa. <strong>È</strong> in Italia per studiare l\'italiano e per fare shopping.',
            'Paolo Rossi <strong>è</strong> il direttore dell\'albergo "Ponte Vecchio". <strong>È</strong> sposato e ha tre figli. <strong>È</strong> sempre molto occupato con i clienti.'
        ]
    },

    // ============================================================
    // SCHEDA 4: COMPRENSIONE (Quiz a risposta multipla)
    // ============================================================
    comprensione: {
        titolo: "🧠 Capiamo il testo",
        istruzioni: "Scegli la risposta corretta per ogni domanda. Clicca direttamente sull'opzione che ritieni giusta.",
        domande: [
            {
                id: "u001_q1",
                testo: "L'albergo Ponte Vecchio è...",
                opzioni: ["a Roma.", "a Firenze."],
                corretta: 1,
                suggerimento: '📖 Controlla: "L\'albergo Ponte Vecchio è a Firenze, in Italia."'
            },
            {
                id: "u001_q2",
                testo: "L'albergo Ponte Vecchio è...",
                opzioni: ["in periferia", "in centro"],
                corretta: 1,
                suggerimento: '📖 Controlla: "È un albergo comodo per gli stranieri, perché è in centro."'
            },
            {
                id: "u001_q3",
                testo: "Victor è...",
                opzioni: ["avvocato.", "direttore."],
                corretta: 0,
                suggerimento: '📖 Controlla: "Victor è francese; è avvocato."'
            },
            {
                id: "u001_q4",
                testo: "Victor è in Italia per...",
                opzioni: ["turismo", "affari"],
                corretta: 1,
                suggerimento: '📖 Controlla: "Adesso è in Italia per affari."'
            },
            {
                id: "u001_q5",
                testo: "Karl e Klaus...",
                opzioni: ["è studente", "sono studenti"],
                corretta: 1,
                suggerimento: '📖 Controlla: "Sono tedeschi e sono studenti."'
            },
            {
                id: "u001_q6",
                testo: "Karl e Klaus studiano...",
                opzioni: ["il tedesco", "l'italiano"],
                corretta: 1,
                suggerimento: '📖 Controlla: "Sono in Italia per studiare l\'italiano."'
            },
            {
                id: "u001_q7",
                testo: "Mary è in Italia...",
                opzioni: ["per insegnare l'inglese", "per insegnare l'italiano"],
                corretta: 0,
                suggerimento: '📖 Controlla: "Mary è inglese; è insegnante, ed è in Italia per insegnare l\'inglese."'
            },
            {
                id: "u001_q8",
                testo: "Mary è...",
                opzioni: ["un'insegnante inglese", "un'insegnante italiana"],
                corretta: 0,
                suggerimento: '📖 Controlla: "Mary è inglese; è insegnante..."'
            },
            {
                id: "u001_q9",
                testo: "Yoko è...",
                opzioni: ["insegnante", "dentista"],
                corretta: 1,
                suggerimento: '📖 Controlla: "Yoko, invece, è giapponese; è dentista..."'
            },
            {
                id: "u001_q10",
                testo: "Yoko è in Italia...",
                opzioni: ["per una conferenza", "per turismo"],
                corretta: 0,
                suggerimento: '📖 Controlla: "...ed è in Italia per una conferenza."'
            },
            {
                id: "u001_q11",
                testo: "Olga è in Italia...",
                opzioni: ["per conoscere ragazzi", "per studiare e fare shopping"],
                corretta: 1,
                suggerimento: '📖 Controlla: "È in Italia per studiare l\'italiano e per fare shopping."'
            },
            {
                id: "u001_q12",
                testo: "Olga è...",
                opzioni: ["una studentessa italiana", "una studentessa di italiano"],
                corretta: 1,
                suggerimento: '📖 Controlla: "Olga è russa. È studentessa. È in Italia per studiare l\'italiano..."'
            },
            {
                id: "u001_q13",
                testo: "Il direttore...",
                opzioni: ["è molto occupato.", "è molto sposato"],
                corretta: 0,
                suggerimento: '📖 Controlla: "È sempre molto occupato con i clienti."'
            }
        ]
    },

    // ============================================================
    // SCHEDA 5: PRODUZIONE DOMANDE
    // ============================================================
    produzioneDomande: {
        titolo: "🎤 Creiamo le domande",
        istruzioni: "Leggi la risposta e scrivi la domanda corretta.",
        esercizi: [
            {
                id: "u001_p1",
                risposta: "L'albergo Ponte Vecchio è a Firenze.",
                guida: "💡 Dove?",
                modello: "Dov'è l'albergo Ponte Vecchio?"
            },
            {
                id: "u001_p2",
                risposta: "L'albergo Ponte Vecchio è in centro.",
                guida: "💡 Dove?",
                modello: "Dov'è l'albergo Ponte Vecchio?"
            },
            {
                id: "u001_p3",
                risposta: "Victor è un avvocato.",
                guida: "💡 Chi? Che lavoro fa?",
                modello: "Chi è Victor?"
            },
            {
                id: "u001_p4",
                risposta: "Victor è in Italia per affari.",
                guida: "💡 Perché?",
                modello: "Perché Victor è in Italia?"
            },
            {
                id: "u001_p5",
                risposta: "Karl e Klaus sono studenti.",
                guida: "💡 Chi?",
                modello: "Chi sono Karl e Klaus?"
            },
            {
                id: "u001_p6",
                risposta: "Karl e Klaus studiano l'italiano.",
                guida: "💡 Perché?",
                modello: "Perché Karl e Klaus sono in Italia?"
            },
            {
                id: "u001_p7",
                risposta: "Mary è in Italia per insegnare l'inglese.",
                guida: "💡 Perché?",
                modello: "Perché Mary è in Italia?"
            },
            {
                id: "u001_p8",
                risposta: "Mary è un'insegnante inglese.",
                guida: "💡 Chi? Che lavoro fa?",
                modello: "Chi è Mary?"
            },
            {
                id: "u001_p9",
                risposta: "Yoko è dentista.",
                guida: "💡 Che lavoro fa?",
                modello: "Che lavoro fa Yoko?"
            },
            {
                id: "u001_p10",
                risposta: "Yoko è in Italia per una conferenza.",
                guida: "💡 Perché?",
                modello: "Perché Yoko è in Italia?"
            },
            {
                id: "u001_p11",
                risposta: "Olga è in Italia per studiare e per fare shopping.",
                guida: "💡 Perché?",
                modello: "Perché Olga è in Italia?"
            },
            {
                id: "u001_p12",
                risposta: "Olga è una studentessa di italiano.",
                guida: "💡 Chi?",
                modello: "Chi è Olga?"
            },
            {
                id: "u001_p13",
                risposta: "Il direttore è molto occupato.",
                guida: "💡 Com'è?",
                modello: "Com'è il direttore?"
            }
        ]
    },

    // ============================================================
    // SCHEDA 6: PRODUZIONE RISPOSTE
    // ============================================================
    produzioneRisposte: {
        titolo: "💬 Parliamone insieme",
        istruzioni: "Rispondi alle domande.",
        esercizi: [
            { id: "u001_r1", domanda: "1) Dov'è l'albergo Ponte Vecchio?" },
            { id: "u001_r2", domanda: "2) Perché è comodo per i turisti?" },
            { id: "u001_r3", domanda: "3) Chi sono i clienti dell'albergo?" },
            { id: "u001_r4", domanda: "4) Chi è Victor?" },
            { id: "u001_r5", domanda: "5) Perché Victor è in Italia?" },
            { id: "u001_r6", domanda: "6) Chi è Yoko?" },
            { id: "u001_r7", domanda: "7) Perché Yoko è in Italia?" },
            { id: "u001_r8", domanda: "8) Chi sono Karl e Klaus?" },
            { id: "u001_r9", domanda: "9) Perché Karl e Klaus sono in Italia?" },
            { id: "u001_r10", domanda: "10) Chi è Olga?" },
            { id: "u001_r11", domanda: "11) Perché Olga è in Italia?" },
            { id: "u001_r12", domanda: "12) Chi è Mary?" },
            { id: "u001_r13", domanda: "13) Perché Mary è in Italia?" },
            { id: "u001_r14", domanda: "14) Chi è il signor Rossi?" }
        ]
    },

    // ============================================================
    // SCHEDA 7: RIORDINA I DIALOGHI
    // ============================================================
    riordinoDialoghi: {
        titolo: "🧩 Riordina i dialoghi",
        istruzioni: "Metti in ordine le frasi.",
        esercizi: [
            {
                id: "u001_dial_1",
                immagine: "img/dialogo_1.webp",
                frasiFisse: [
                    "— Ciao Olga! Sei inglese?"
                ],
                frasiMobili: [
                    { id: "d1_f1", testo: "— No, non sono inglese; sono russa." },
                    { id: "d1_f2", testo: "— Tu lavori o studi?" },
                    { id: "d1_f3", testo: "— Sono studentessa." },
                    { id: "d1_f4", testo: "— Perché sei in Italia?" },
                    { id: "d1_f5", testo: "— Perché la moda italiana è bella." }
                ],
                ordineCorretto: ["d1_f1", "d1_f2", "d1_f3", "d1_f4", "d1_f5"],
                variantiAccettate: [
                    ["d1_f1", "d1_f4", "d1_f5", "d1_f2", "d1_f3"]
                ]
            },
            {
                id: "u001_dial_2",
                immagine: "img/dialogo_2.webp",
                frasiFisse: [
                    "— Buongiorno Victor! Lei è tedesco?"
                ],
                frasiMobili: [
                    { id: "d2_f1", testo: "— No, non sono tedesco, sono francese." },
                    { id: "d2_f2", testo: "— Lei è ingegnere?" },
                    { id: "d2_f3", testo: "— No, sono avvocato." },
                    { id: "d2_f4", testo: "— Perché è in Italia?" },
                    { id: "d2_f5", testo: "— Per affari." }
                ],
                ordineCorretto: ["d2_f1", "d2_f2", "d2_f3", "d2_f4", "d2_f5"],
                variantiAccettate: [
                    ["d2_f1", "d2_f3", "d2_f4", "d2_f5", "d2_f2"]
                ]
            },
            {
                id: "u001_dial_3",
                immagine: "img/dialogo_3.webp",
                frasiFisse: [
                    "— Buongiorno Karl e Klaus! Voi siete stranieri?"
                ],
                frasiMobili: [
                    { id: "d3_f1", testo: "— Sì, siamo stranieri; siamo tedeschi." },
                    { id: "d3_f2", testo: "— Siete in Italia per turismo?" },
                    { id: "d3_f3", testo: "— No, siamo qui per studiare l'italiano." },
                    { id: "d3_f4", testo: "— Abitate in albergo?" },
                    { id: "d3_f5", testo: "— Sì, siamo clienti dell'albergo Ponte Vecchio." }
                ],
                ordineCorretto: ["d3_f1", "d3_f2", "d3_f3", "d3_f4", "d3_f5"],
                variantiAccettate: [
                    ["d3_f1", "d3_f4", "d3_f5", "d3_f2", "d3_f3"]
                ]
            }
        ]
    }
};
