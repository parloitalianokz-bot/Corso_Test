// ================================================================
// DATI DELLA LEZIONE - Unità 001: Motivazione e Presentazioni
// ================================================================

export const datiLezione = {
    // Intestazione
    titolo: "Unità 1 - Un albergo in centro",
    sottotitolo: "Livello A1 - Iniziamo a viaggiare",
    bannerImg: "../../unita_001/img/banner_unita1.webp",  // ← percorso corretto

    // Badge utente (fisso per test)
    badge: {
        nome: "Antonio",
        gruppo: "Venezia",
        icona: "👤"
    },

    // Contenuto della lezione
    elicitazione: {
        sceltaPersonale: {
            domanda: '📌 Perché studi l\'italiano?',
            fraseBase: 'Io studio l\'italiano...',
            idFirebase: 'unita_001_motivazione',
            opzioni: [
                { 
                    id: 'turismo', 
                    etichetta: 'per turismo', 
                    img: 'https://via.placeholder.com/150/4CAF50/white?text=🌍+Turismo' 
                },
                { 
                    id: 'studio', 
                    etichetta: 'per studio', 
                    img: 'https://via.placeholder.com/150/2196F3/white?text=📚+Studio' 
                },
                { 
                    id: 'amore', 
                    etichetta: 'per amore', 
                    img: 'https://via.placeholder.com/150/E91E63/white?text=❤️+Amore' 
                },
                { 
                    id: 'lavoro', 
                    etichetta: 'per lavoro', 
                    img: 'https://via.placeholder.com/150/FF9800/white?text=💼+Lavoro' 
                }
            ]
        }
    }
};
