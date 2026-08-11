// ================================================================
// DATI DELLA LEZIONE - Unità 001: Motivazione e Presentazioni
// ================================================================

export const datiLezione = {
    titolo: "Unità 1 - Un albergo in centro",
    sottotitolo: "Livello A1 - Iniziamo a viaggiare",
    bannerImg: "img/banner_unita1.webp",

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

    forum: {
        idFirebase: 'unita001_forum_parole',
        domanda: '🇮🇹 Che altre parole italiane conosci?',
        placeholder: 'Scrivi una parola italiana...',
        mostraNumeroParole: true
    }
};
