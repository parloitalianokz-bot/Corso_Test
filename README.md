# 🏗️ Architettura del Progetto

## Principio Fondamentale

> **Ogni modulo è un mattone. Le schede sono stanze. Le unità sono case.**

L'intero progetto è costruito su un'architettura modulare che garantisce **scalabilità, manutenibilità e riusabilità**. Questa struttura permette di creare fino a 100 unità didattiche in modo efficiente e coerente.

---

## 📊 I Tre Livelli

| Livello | Funzione | Esempio |
|---------|----------|---------|
| **Modulo** | Singola attività interattiva | `forum.js`, `cloze.js`, `associazione.js` |
| **Scheda** | Combinazione di moduli + HTML statico | Scheda 9: statico + forum |
| **Unità** | Insieme di schede | Unità 001: 9 schede |

---

## 🧩 I Moduli

### Principi di Progettazione

1. **Universalità** - I moduli sono progettati per essere universali e riutilizzabili in qualsiasi contesto
2. **Indipendenza** - Un modulo non deve conoscere la scheda che lo usa; riceve solo dati e produce comportamento
3. **Configurabilità** - Il comportamento è definito dai dati, non dal codice
4. **Prevedibilità** - Gli ID Firebase seguono un pattern uniforme: `unita_{numero}_{scheda}_{attivita}`

### Moduli Esistenti

| Modulo | Funzione | Schede che lo usano |
|--------|----------|---------------------|
| `login.js` | Autenticazione | Tutte |
| `intestazione.js` | Header della lezione | Tutte |
| `flashcard.js` | Vocabolario con audio | 1 e future unità |
| `forum.js` | Discussione e risposte | 1, 2, 9 e future unità |
| `lavagna.js` | Collaborazione in tempo reale | 2, 3 e future unità |
| `glossario.js` | Traduzioni interattive | 3 e future unità |
| `sceltaOpzioni.js` | Quiz a risposta multipla | 4 e future unità |
| `creaDomande.js` | Produzione di domande | 5 e future unità |
| `parliamoneInsieme.js` | Produzione di risposte | 6 e future unità |
| `riordinaDialoghi.js` | Riordino di dialoghi | 7 e future unità |
| `cloze.js` | Completamento di testi | 8 e future unità |
| `associazione.js` | Associazione/riordino di elementi | 8 e future unità |
| `sceltaPersonale.js` | Scelta con immagini | 1 e future unità |

---

## 🎯 Come Costruire una Scheda

### Schema Generale

```javascript
// In index.html - renderSchedaX()
function renderSchedaX() {
    const dati = datiLezione.schedaX;
    if (!dati) return '';
    
    let html = '';
    
    dati.fasi.forEach(fase => {
        // 1. Contenuto statico (HTML puro)
        if (fase.soloInformativa) {
            html += `<div class="fase">${fase.contenuto}</div>`;
        }
        
        // 2. Attività con moduli universali
        if (fase.forum) {
            html += generaForum({ forum: fase.forum });
        }
        if (fase.cloze) {
            html += generaCloze([fase], isDocente);
        }
        if (fase.associazione) {
            html += generaAssociazione([fase], isDocente);
        }
        if (fase.esercizi) {
            fase.esercizi.forEach(ex => {
                html += generaForum({ forum: ex.forum });
            });
        }
    });


Regole per le Schede
Usa prima i moduli esistenti

Se non bastano, valuta se il nuovo caso merita un modulo universale

Altrimenti usa HTML statico

📁 Struttura delle Unità
Organizzazione dei File

/Corso_Test/
├── moduli/                    # Moduli universali
│   ├── index.js              # Entry point
│   ├── forum.js
│   ├── cloze.js
│   └── ...
├── unita/
│   └── unita_001/
│       ├── index.html        # Pagina dell'unità
│       ├── dati-lezione.js   # Configurazione
│       └── img/              # Immagini specifiche
└── style.css                 # Stili globali


Struttura di dati-lezione.js
export const datiLezione = {
    // Intestazione (sempre uguale)
    titolo: "...",
    sottotitolo: "...",
    bannerImg: "...",
    
    // Schede
    scheda1: {
        // Configurazione specifica
    },
    // ...
    schedaN: {
        // Configurazione specifica
    }
};

Pattern per gli ID Firebase
unita_{numero}_{scheda}_{attivita}_{id}

Esempi:

unita_001_forum_parole

unita_001_negazione_1

unita_001_gram_f1

🛠️ Come Aggiungere una Nuova Unità
Passaggi
Crea la cartella unita/unita_XXX/

Copia index.html e dati-lezione.js da un'unità esistente

Modifica dati-lezione.js con i contenuti specifici

Usa solo moduli esistenti quando possibile

Se necessario, crea un nuovo modulo universale nella cartella moduli/

Aggiorna la homepage (index.html nella root) con il link alla nuova unità

✅ Vantaggi dell'Architettura
Vantaggio	Descrizione
Scalabilità	Aggiungere 100 unità è semplice e veloce
Manutenibilità	Un bug si corregge in un modulo, non in 100 unità
Consistenza	La UI è uniforme in tutto il corso
Velocità	Nuove unità si creano copiando dati, non codice
Testabilità	I moduli possono essere testati singolarmente
📋 Regole d'Oro
I moduli sono universali - Non devono conoscere la scheda che li usa

I dati sono separati dal codice - Le configurazioni sono in dati-lezione.js

Le schede combinano moduli + HTML statico - Non creare moduli per singole schede

Gli ID sono prevedibili - Seguono il pattern unita_{numero}_{scheda}_{attivita}

Prima riusa, poi crea - Usa moduli esistenti; crea nuovi moduli solo se veramente necessari

🚀 Prossimi Passi
Con questa architettura, il progetto è pronto per essere esteso fino a 100 unità in modo efficiente e mantenibile.

Ogni nuova unità segue lo stesso pattern:

Copia la struttura

Modifica i dati

Usa i moduli esistenti

Testa e pubblica
    
    return html;
}
