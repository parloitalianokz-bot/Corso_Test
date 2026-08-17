// ================================================================
// UNITÀ 2: Un bravo ragazzo
// ================================================================

function convertiValore(numero) {
    const unita = [
        "zero", "uno", "due", "tre", "quattro",
        "cinque", "sei", "sette", "otto", "nove",
        "dieci", "undici", "dodici", "tredici", "quattordici",
        "quindici", "sedici", "diciassette", "diciotto", "diciannove"
    ];

    const decine = [
        "", "", "venti", "trenta", "quaranta",
        "cinquanta", "sessanta", "settanta", "ottanta", "novanta"
    ];

    if (numero < 20) return unita[numero];

    if (numero < 100) {
        const decina = Math.floor(numero / 10);
        const resto = numero % 10;
        let risultato = decine[decina];

        if (resto === 1 || resto === 8) {
            risultato = risultato.slice(0, -1);
        }

        return risultato + (resto ? unita[resto] : "");
    }

    if (numero === 100) return "cento";

    if (numero < 120) {
        return `cento${convertiValore(numero - 100)}`;
    }

    return String(numero);
}

export const datiLezione = {
    numeroUnita: 2,

    titolo: "Unità 2 - Un bravo ragazzo",
    sottotitolo: "Livello A1 - Possesso e sensazioni",
    bannerImg: "img/banner_unita2.webp",

    schede: [
        { id: "scheda_1", titolo: "🧊 Per rompere il ghiaccio", tipo: "scheda1", dati: null },
        { id: "scheda_2", titolo: "🎧 Orecchie aperte! (Ascolto)", tipo: "scheda2", dati: null },
        { id: "scheda_3", titolo: "📖 Leggiamo insieme", tipo: "scheda3", dati: null },
        { id: "scheda_4", titolo: "🧠 Capiamo il testo", tipo: "sceltaOpzioni", dati: "comprensione" },
        { id: "scheda_5", titolo: "🎤 Creiamo le domande", tipo: "creaDomande", dati: "produzioneDomande" },
        { id: "scheda_6", titolo: "💬 Parliamone insieme", tipo: "parliamoneInsieme", dati: "produzioneRisposte" },
        { id: "scheda_7", titolo: "🧩 Riordina i dialoghi", tipo: null, dati: null },
        { id: "scheda_8", titolo: "🎯 Essere o avere?", tipo: null, dati: null },
        { id: "scheda_9", titolo: "🔍 Alla scoperta della grammatica", tipo: null, dati: null },
        { id: "scheda_10", titolo: "🕵️ Chi è? (Indovinelli)", tipo: null, dati: null },
        { id: "scheda_11", titolo: "🔢 I numeri italiani", tipo: null, dati: null },
        { id: "scheda_12", titolo: "🏠 Cosa hanno...?", tipo: null, dati: null },
        { id: "scheda_13", titolo: "💎 Le mie 3 cose importanti", tipo: null, dati: null },
        { id: "scheda_14", titolo: "🗣️ Parla con un compagno", tipo: null, dati: null },
        { id: "scheda_15", titolo: "🎤 Parliamo di noi", tipo: null, dati: null },
        { id: "scheda_16", titolo: "✅ Autovalutazione", tipo: null, dati: null }
    ],

    scheda_1: {
        titolo: "🧊 Per rompere il ghiaccio",
        istruzioni: "Guarda l'immagine e inizia a presentarti. Tu chi sei?",
        immaginePrincipale: "img/warmup_unita2.webp",

        sceltaPersonale: {
            titolo: "👥 Scegli la tua categoria:",
            fraseBase: "Io sono...",
            fraseClasse: "{nome} è {etichetta}",
            idFirebase: "u002_scelta_personale",

            opzioni: [
                {
                    id: "cat_bambino",
                    testo: "👦 Bambino / 👧 Bambina",
                    valore: "bambino",
                    img: "img/personaggi/bambino.webp"
                },
                {
                    id: "cat_ragazzo",
                    testo: "🧑 Ragazzo / 👩 Ragazza",
                    valore: "ragazzo",
                    img: "img/personaggi/ragazza.webp"
                },
                {
                    id: "cat_uomo",
                    testo: "👨 Uomo / 👩 Donna",
                    valore: "uomo",
                    img: "img/personaggi/adulto.webp"
                },
                {
                    id: "cat_anziano",
                    testo: "👴 Anziano / 👵 Anziana",
                    valore: "anziano",
                    img: "img/personaggi/anziano.webp"
                }
            ]
        },

        attivita_2: {
            titolo: "📌 Attività 2: Mangiare e bere",

            cibi: {
                istruzioni: "Scopri i cibi italiani, poi scrivi le tue risposte!",
                domanda: "🍝 Cosa mangi quando hai fame?",

                vocabolario: [
                    { parola: "Bistecca alla Fiorentina", audio: "audio/cibi/bistecca-alla-fiorentina.mp3", img: "img/cibi/bistecca-alla-fiorentina.webp" },
                    { parola: "Bruschette", audio: "audio/cibi/bruschette.mp3", img: "img/cibi/bruschette.webp" },
                    { parola: "Caprese", audio: "audio/cibi/caprese.mp3", img: "img/cibi/caprese.webp" },
                    { parola: "Gelato", audio: "audio/cibi/gelato.mp3", img: "img/cibi/gelato.webp" },
                    { parola: "Lasagne", audio: "audio/cibi/lasagne.mp3", img: "img/cibi/lasagne.webp" },
                    { parola: "Pizza", audio: "audio/cibi/pizza.mp3", img: "img/cibi/pizza.webp" },
                    { parola: "Ravioli", audio: "audio/cibi/ravioli.mp3", img: "img/cibi/ravioli.webp" },
                    { parola: "Risotto", audio: "audio/cibi/risotto.mp3", img: "img/cibi/risotto.webp" },
                    { parola: "Spaghetti ai Frutti di Mare", audio: "audio/cibi/spaghetti-frutti-di-mare.mp3", img: "img/cibi/spaghetti-frutti-di-mare.webp" },
                    { parola: "Spaghetti alla Carbonara", audio: "audio/cibi/spaghetti-carbonara.mp3", img: "img/cibi/spaghetti-carbonara.webp" },
                    { parola: "Tiramisù", audio: "audio/cibi/tiramisu.mp3", img: "img/cibi/tiramisu.webp" }
                ],

                forum: {
                    idFirebase: "u002_mangiare_quando_ho_fame",
                    domanda: "✍️ La tua risposta:<br>Quando ho fame, mangio...",
                    placeholder: "Scrivi qui la tua risposta..."
                }
            },

            bevande: {
                istruzioni: "Ecco alcune idee:",
                domanda: "🥤 Cosa bevi quando hai sete?",

                vocabolario: [
                    { parola: "Acqua", audio: "audio/bevande/acqua.mp3", img: "img/bevande/acqua.webp" },
                    { parola: "Aranciata", audio: "audio/bevande/aranciata.mp3", img: "img/bevande/aranciata.webp" },
                    { parola: "Birra", audio: "audio/bevande/birra.mp3", img: "img/bevande/birra.webp" },
                    { parola: "Caffè", audio: "audio/bevande/caffe.mp3", img: "img/bevande/caffe.webp" },
                    { parola: "Cappuccino", audio: "audio/bevande/cappuccino.mp3", img: "img/bevande/cappuccino.webp" },
                    { parola: "Coca Cola", audio: "audio/bevande/coca-cola.mp3", img: "img/bevande/coca-cola.webp" },
                    { parola: "Limoncello", audio: "audio/bevande/limoncello.mp3", img: "img/bevande/limoncello.webp" },
                    { parola: "Prosecco", audio: "audio/bevande/prosecco.mp3", img: "img/bevande/prosecco.webp" },
                    { parola: "Succo di frutta", audio: "audio/bevande/succo-di-frutta.mp3", img: "img/bevande/succo-di-frutta.webp" },
                    { parola: "Tè", audio: "audio/bevande/te.mp3", img: "img/bevande/te.webp" },
                    { parola: "Vino", audio: "audio/bevande/vino.mp3", img: "img/bevande/vino.webp" }
                ],

                forum: {
                    idFirebase: "u002_bere_quando_ha_sete",
                    domanda: "✍️ La tua risposta:<br>Quando ho sete, bevo...",
                    placeholder: "Scrivi qui la tua risposta..."
                }
            }
        },

        attivita_3: {
            titolo: "📌 Attività 3: Quanti anni hai?",
            istruzioni: "Scrivi la tua età in cifre e scopri come si scrive in italiano!",
            id: "u002_eta",
            idFirebase: "u002_eta",
            tipoInput: "number",
            etichettaInput: "✍️ La tua risposta",
            placeholderInput: "Inserisci la tua età in cifre",
            etichettaOutput: "📝 La frase in italiano",
            titoloCondivisi: "💬 Le età della classe",
            testoBottone: "💾 Salva",
            messaggioVuoto: "Ancora nessuna risposta...",
            validazione: {
                tipo: "numero",
                min: 1,
                max: 120
            },
            trasforma: valore => `Io ho ${convertiValore(Number(valore))} anni`,
            valoreCondiviso: valore => convertiValore(Number(valore))
        }
    },

    scheda_3: {
        titolo: "Un bravo ragazzo",
        sfondo: "img/sfondo_pagina_libro.webp",

        brainstorming: {
            id: "u002_lettura_brainstorming",
            titolo: "✍️ Vocabolario: quali parole nuove hai trovato?",
            placeholder: "Scrivi qui le parole nuove che hai trovato..."
        },

        tooltip: [
            { parola: "a letto", traduzione_ru: "в постели" },
            { parola: "chiama", traduzione_ru: "звонит / зовёт" },
            { parola: "dice", traduzione_ru: "говорит" },
            { parola: "ho sete", traduzione_ru: "я хочу пить" },
            { parola: "bicchiere", traduzione_ru: "стакан" },
            { parola: "ho fame", traduzione_ru: "я хочу есть" },
            { parola: "ho freddo", traduzione_ru: "мне холодно" },
            { parola: "coperta", traduzione_ru: "одеяло" },
            { parola: "ho sonno", traduzione_ru: "я хочу спать" },
            { parola: "spegne la luce", traduzione_ru: "выключает свет" },
            { parola: "chiude la finestra", traduzione_ru: "закрывает окно" },
            { parola: "ho paura", traduzione_ru: "мне страшно" }
        ],

        glossario: [
            { parola: "casa", traduzione_ru: "дом", pronuncia_ru: "каза", audio: "audio/glossario/casa.mp3" },
            { parola: "letto", traduzione_ru: "кровать", pronuncia_ru: "летто", audio: "audio/glossario/letto.mp3" },
            { parola: "cucina", traduzione_ru: "кухня", pronuncia_ru: "кучина", audio: "audio/glossario/cucina.mp3" },
            { parola: "chiamare", traduzione_ru: "звать / звонить", pronuncia_ru: "кьямаре", audio: "audio/glossario/chiamare.mp3" },
            { parola: "dire", traduzione_ru: "говорить", pronuncia_ru: "дире", audio: "audio/glossario/dire.mp3" },
            { parola: "sete", traduzione_ru: "жажда", pronuncia_ru: "сете", audio: "audio/glossario/sete.mp3" },
            { parola: "portare", traduzione_ru: "приносить", pronuncia_ru: "портаре", audio: "audio/glossario/portare.mp3" },
            { parola: "bicchiere", traduzione_ru: "стакан", pronuncia_ru: "биккьере", audio: "audio/glossario/bicchiere.mp3" },
            { parola: "bere", traduzione_ru: "пить", pronuncia_ru: "бере", audio: "audio/glossario/bere.mp3" },
            { parola: "fame", traduzione_ru: "голод", pronuncia_ru: "фаме", audio: "audio/glossario/fame.mp3" },
            { parola: "piatto", traduzione_ru: "тарелка", pronuncia_ru: "пьятто", audio: "audio/glossario/piatto.mp3" },
            { parola: "mangiare", traduzione_ru: "есть", pronuncia_ru: "манджаре", audio: "audio/glossario/mangiare.mp3" },
            { parola: "freddo", traduzione_ru: "холод", pronuncia_ru: "фреддо", audio: "audio/glossario/freddo.mp3" },
            { parola: "coperta", traduzione_ru: "одеяло", pronuncia_ru: "коперта", audio: "audio/glossario/coperta.mp3" },
            { parola: "sonno", traduzione_ru: "сонливость", pronuncia_ru: "сонно", audio: "audio/glossario/sonno.mp3" },
            { parola: "spegnere", traduzione_ru: "выключать", pronuncia_ru: "спеньере", audio: "audio/glossario/spegnere.mp3" },
            { parola: "luce", traduzione_ru: "свет", pronuncia_ru: "луче", audio: "audio/glossario/luce.mp3" },
            { parola: "chiudere", traduzione_ru: "закрывать", pronuncia_ru: "кьюдере", audio: "audio/glossario/chiudere.mp3" },
            { parola: "finestra", traduzione_ru: "окно", pronuncia_ru: "финестра", audio: "audio/glossario/finestra.mp3" },
            { parola: "dormire", traduzione_ru: "спать", pronuncia_ru: "дормире", audio: "audio/glossario/dormire.mp3" },
            { parola: "un po'", traduzione_ru: "немного", pronuncia_ru: "ун по", audio: "audio/glossario/un-po.mp3" },
            { parola: "paura", traduzione_ru: "страх", pronuncia_ru: "паура", audio: "audio/glossario/paura.mp3" }
        ],

        paragrafi: [
            "La mamma e suo figlio Marco sono in casa. Marco è in camera, è a letto; la madre è in cucina.",
            "Il figlio chiama la madre e dice: “Mamma, <strong>ho sete</strong>”. Allora la madre porta un bicchiere d'acqua. Il figlio beve l'acqua, e non ha più sete.",
            "Ma poi dice: “Mamma, <strong>ho fame</strong>”. Allora la madre porta un piatto di pasta. Marco mangia la pasta, e non ha più fame.",
            "Ma poi dice: “Mamma, <strong>ho freddo</strong>”. Allora la madre porta una coperta. Con la coperta, il figlio non ha più freddo.",
            "Ma poi dice: “Mamma, <strong>ho sonno</strong>”. Allora la madre spegne la luce e chiude la finestra, e lui dorme.",
            "Marco dorme un po', e poi dice: “Mamma, <strong>ho paura</strong>”.",
            "Allora la madre dice: “Perché hai paura? Non sei più un bambino. <strong>Hai trentacinque anni</strong>”."
        ]
    },

    comprensione: {
        titolo: "🧠 Capiamo il testo",
        istruzioni: "Scegli la risposta corretta.",
        domande: [
            {
                id: "u002_q1",
                testo: "La madre...",
                opzioni: ["è in cucina", "è in camera", "è a letto"],
                corretta: 0,
                suggerimento: '📖 Nel testo: "La madre è in cucina."'
            },
            {
                id: "u002_q2",
                testo: "Il figlio...",
                opzioni: ["è in cucina", "è a scuola", "è a letto"],
                corretta: 2,
                suggerimento: '📖 Nel testo: "Marco è in camera, è a letto."'
            },
            {
                id: "u002_q3",
                testo: "Quando il figlio ha sete, la madre porta...",
                opzioni: ["un piatto di pasta", "un bicchiere d'acqua", "una coperta"],
                corretta: 1,
                suggerimento: '📖 Nel testo: "Mamma, ho sete. Allora la madre porta un bicchiere d’acqua."'
            },
            {
                id: "u002_q4",
                testo: "Quando il figlio ha fame, la madre porta...",
                opzioni: ["una coperta", "una finestra", "un piatto di pasta"],
                corretta: 2,
                suggerimento: '📖 Nel testo: "Mamma, ho fame. Allora la madre porta un piatto di pasta."'
            },
            {
                id: "u002_q5",
                testo: "Quando il figlio ha freddo, la madre porta...",
                opzioni: ["una finestra", "una coperta", "un bicchiere d'acqua"],
                corretta: 1,
                suggerimento: '📖 Nel testo: "Mamma, ho freddo. Allora la madre porta una coperta."'
            },
            {
                id: "u002_q6",
                testo: "Quando il figlio ha sonno, la madre...",
                opzioni: ["apre la finestra", "chiude la coperta", "spegne la luce"],
                corretta: 2,
                suggerimento: '📖 Nel testo: "Mamma, ho sonno. Allora la madre spegne la luce e chiude la finestra."'
            },
            {
                id: "u002_q7",
                testo: "Il figlio...",
                opzioni: ["è piccolo", "è grande"],
                corretta: 1,
                suggerimento: '📖 Nel testo: "Non sei più un bambino. Hai trentacinque anni."'
            }
        ]
    },

    produzioneDomande: {
        titolo: "🎤 Creiamo le domande",
        istruzioni: "Leggi la risposta e scrivi la domanda corretta.",
        esercizi: [
            {
                id: "u002_p1",
                risposta: "Marco è a letto.",
                guida: "💡 Dove?",
                modello: "Dov'è Marco?"
            },
            {
                id: "u002_p2",
                risposta: "La madre è in cucina.",
                guida: "💡 Dove?",
                modello: "Dov'è la madre?"
            },
            {
                id: "u002_p3",
                risposta: "Quando il figlio ha sete, la madre porta un bicchiere d'acqua.",
                guida: "💡 Che cosa?",
                modello: "Che cosa porta la madre quando il figlio ha sete?"
            },
            {
                id: "u002_p4",
                risposta: "Quando il figlio ha fame, la madre porta un piatto di pasta.",
                guida: "💡 Che cosa?",
                modello: "Che cosa porta la madre quando il figlio ha fame?"
            },
            {
                id: "u002_p5",
                risposta: "Quando il figlio ha freddo, la madre porta una coperta.",
                guida: "💡 Che cosa?",
                modello: "Che cosa porta la madre quando il figlio ha freddo?"
            },
            {
                id: "u002_p6",
                risposta: "Quando il figlio ha sonno, la madre spegne la luce.",
                guida: "💡 Che cosa?",
                modello: "Che cosa fa la madre quando il figlio ha sonno?"
            },
            {
                id: "u002_p7",
                risposta: "Marco ha 35 anni.",
                guida: "💡 Quanti?",
                modello: "Quanti anni ha Marco?"
            },
            {
                id: "u002_p8",
                risposta: "Marco beve l'acqua.",
                guida: "💡 Che cosa?",
                modello: "Che cosa beve Marco?"
            },
            {
                id: "u002_p9",
                risposta: "Marco mangia la pasta.",
                guida: "💡 Che cosa?",
                modello: "Che cosa mangia Marco?"
            },
            {
                id: "u002_p10",
                risposta: "Marco è grande.",
                guida: "💡 Come?",
                modello: "Com'è Marco?"
            }
        ]
    }
};
