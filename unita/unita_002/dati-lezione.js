// ================================================================
// UNITÀ 2: Un bravo ragazzo
// ================================================================

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
                    {
                        parola: "Bistecca alla Fiorentina",
                        audio: "audio/cibi/bistecca-alla-fiorentina.mp3",
                        img: "img/cibi/bistecca-alla-fiorentina.webp"
                    },
                    {
                        parola: "Bruschette",
                        audio: "audio/cibi/bruschette.mp3",
                        img: "img/cibi/bruschette.webp"
                    },
                    {
                        parola: "Caprese",
                        audio: "audio/cibi/caprese.mp3",
                        img: "img/cibi/caprese.webp"
                    },
                    {
                        parola: "Gelato",
                        audio: "audio/cibi/gelato.mp3",
                        img: "img/cibi/gelato.webp"
                    },
                    {
                        parola: "Lasagne",
                        audio: "audio/cibi/lasagne.mp3",
                        img: "img/cibi/lasagne.webp"
                    },
                    {
                        parola: "Pizza",
                        audio: "audio/cibi/pizza.mp3",
                        img: "img/cibi/pizza.webp"
                    },
                    {
                        parola: "Ravioli",
                        audio: "audio/cibi/ravioli.mp3",
                        img: "img/cibi/ravioli.webp"
                    },
                    {
                        parola: "Risotto",
                        audio: "audio/cibi/risotto.mp3",
                        img: "img/cibi/risotto.webp"
                    },
                    {
                        parola: "Spaghetti ai Frutti di Mare",
                        audio: "audio/cibi/spaghetti-frutti-di-mare.mp3",
                        img: "img/cibi/spaghetti-frutti-di-mare.webp"
                    },
                    {
                        parola: "Spaghetti alla Carbonara",
                        audio: "audio/cibi/spaghetti-carbonara.mp3",
                        img: "img/cibi/spaghetti-carbonara.webp"
                    },
                    {
                        parola: "Tiramisù",
                        audio: "audio/cibi/tiramisu.mp3",
                        img: "img/cibi/tiramisu.webp"
                    }
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
                    {
                        parola: "Acqua",
                        audio: "audio/bevande/acqua.mp3",
                        img: "img/bevande/acqua.webp"
                    },
                    {
                        parola: "Aranciata",
                        audio: "audio/bevande/aranciata.mp3",
                        img: "img/bevande/aranciata.webp"
                    },
                    {
                        parola: "Birra",
                        audio: "audio/bevande/birra.mp3",
                        img: "img/bevande/birra.webp"
                    },
                    {
                        parola: "Caffè",
                        audio: "audio/bevande/caffe.mp3",
                        img: "img/bevande/caffe.webp"
                    },
                    {
                        parola: "Cappuccino",
                        audio: "audio/bevande/cappuccino.mp3",
                        img: "img/bevande/cappuccino.webp"
                    },
                    {
                        parola: "Coca Cola",
                        audio: "audio/bevande/coca-cola.mp3",
                        img: "img/bevande/coca-cola.webp"
                    },
                    {
                        parola: "Limoncello",
                        audio: "audio/bevande/limoncello.mp3",
                        img: "img/bevande/limoncello.webp"
                    },
                    {
                        parola: "Prosecco",
                        audio: "audio/bevande/prosecco.mp3",
                        img: "img/bevande/prosecco.webp"
                    },
                    {
                        parola: "Succo di frutta",
                        audio: "audio/bevande/succo-di-frutta.mp3",
                        img: "img/bevande/succo-di-frutta.webp"
                    },
                    {
                        parola: "Tè",
                        audio: "audio/bevande/te.mp3",
                        img: "img/bevande/te.webp"
                    },
                    {
                        parola: "Vino",
                        audio: "audio/bevande/vino.mp3",
                        img: "img/bevande/vino.webp"
                    }
                ],

                forum: {
                    idFirebase: "u002_bere_quando_ha_sete",
                    domanda: "✍️ La tua risposta:<br>Quando ho sete, bevo...",
                    placeholder: "Scrivi qui la tua risposta..."
                }
            }
        }
    }
};
