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
    },

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

    lettura: {
        titolo: 'Un albergo in centro',
        sfondo: 'img/sfondo_pagina_libro.webp',
        brainstorming: {
            id: 'u001_lettura_brainstorming',
            titolo: '✍️ Vocabolario: Quali parole nuove hai trovato?',
            placeholder: 'Scrivi qui le parole nuove che hai trovato...'
        },
        paragrafi: [
            'L\'albergo "Ponte Vecchio" <strong>è</strong> a Firenze, in Italia. <strong>È</strong> un albergo grande, con molte camere. <strong>È</strong> un albergo comodo per gli stranieri, perché <strong>è</strong> in centro.',
            'Chi <strong>sono</strong> gli ospiti dell\'albergo "Ponte Vecchio" in questo momento?',
            'Victor <strong>è</strong> un cliente dell\'albergo. Victor <strong>è</strong> francese; <strong>è</strong> avvocato. Adesso <strong>è</strong> in Italia per affari.',
            'Anche Klaus e Karl <strong>sono</strong> clienti dell\'albergo. <strong>Sono</strong> tedeschi e <strong>sono</strong> studenti. <strong>Sono</strong> in Italia per studiare l\'italiano.',
            'Mary <strong>è</strong> inglese; <strong>è</strong> insegnante, ed <strong>è</strong> in Italia per insegnare l\'inglese. Yoko, invece, <strong>è</strong> giapponese; <strong>è</strong> dentista ed <strong>è</strong> in Italia per una conferenza.',
            'Olga <strong>è</strong> russa. <strong>È</strong> studentessa. <strong>È</strong> in Italia per studiare l\'italiano e per fare shopping.',
            'Paolo Rossi <strong>è</strong> il direttore dell\'albergo "Ponte Vecchio". <strong>È</strong> sposato e ha tre figli. <strong>È</strong> sempre molto occupato con i clienti.'
        ]
    }
};
