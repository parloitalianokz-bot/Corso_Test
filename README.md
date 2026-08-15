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
    
    return html;
}
