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
    unita: "unita_002",

    titolo: "Unità 2 - Un bravo ragazzo",
    sottotitolo: "Livello A1 - Possesso e sensazioni",
    bannerImg: "img/banner_unita2.webp",

    titoloUnita: "Unità 2 - Un bravo ragazzo",
    sottotitoloUnita: "Livello A1 - Possesso e sensazioni",
    bannerUnita: "img/banner_unita2.webp",

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
            { parola: "casa", traduzione_ru: "дом", pronuncia_ru: "каза" },
            { parola: "letto", traduzione_ru: "кровать", pronuncia_ru: "летто" },
            { parola: "cucina", traduzione_ru: "кухня", pronuncia_ru: "кучина" },
            { parola: "chiamare", traduzione_ru: "звать / звонить", pronuncia_ru: "кьямаре" },
            { parola: "dire", traduzione_ru: "говорить", pronuncia_ru: "дире" },
            { parola: "sete", traduzione_ru: "жажда", pronuncia_ru: "сете" },
            { parola: "portare", traduzione_ru: "приносить", pronuncia_ru: "портаре" },
            { parola: "bicchiere", traduzione_ru: "стакан", pronuncia_ru: "биккьере" },
            { parola: "bere", traduzione_ru: "пить", pronuncia_ru: "бере" },
            { parola: "fame", traduzione_ru: "голод", pronuncia_ru: "фаме" },
            { parola: "piatto", traduzione_ru: "тарелка", pronuncia_ru: "пьятто" },
            { parola: "mangiare", traduzione_ru: "есть", pronuncia_ru: "манджаре" },
            { parola: "freddo", traduzione_ru: "холод", pronuncia_ru: "фреддо" },
            { parola: "coperta", traduzione_ru: "одеяло", pronuncia_ru: "коперта" },
            { parola: "sonno", traduzione_ru: "сонливость", pronuncia_ru: "сонно" },
            { parola: "spegnere", traduzione_ru: "выключать", pronuncia_ru: "спеньере" },
            { parola: "luce", traduzione_ru: "свет", pronuncia_ru: "луче" },
            { parola: "chiudere", traduzione_ru: "закрывать", pronuncia_ru: "кьюдере" },
            { parola: "finestra", traduzione_ru: "окно", pronuncia_ru: "финестра" },
            { parola: "dormire", traduzione_ru: "спать", pronuncia_ru: "дормире" },
            { parola: "un po'", traduzione_ru: "немного", pronuncia_ru: "ун по" },
            { parola: "paura", traduzione_ru: "страх", pronuncia_ru: "паура" }
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
    }
};
