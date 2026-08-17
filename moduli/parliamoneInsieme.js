import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let db = null;
let modalitaCorrente = "scrittura";
let modalitaListener = new Map();
const contesti = new Map();

function iniettaCss() {
    if (document.getElementById("parliamone-insieme-css")) return;

    const style = document.createElement("style");
    style.id = "parliamone-insieme-css";
    style.textContent = `
        .parliamone-container { margin: 16px 0; }
        .parliamone-container h3 {
            text-align: center;
            color: var(--primary-color, #1a6e3a);
            margin-bottom: 8px;
        }
        .parliamone-regia {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 15px 20px;
            background: #e8f4f8;
            border: 2px solid #3498db;
            border-radius: 12px;
        }
        .parliamone-regia button,
        .parliamone-form button,
        .parliamone-riapri button,
        .parliamone-azioni button {
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            color: white;
            font-weight: 600;
        }
        .btn-scrittura { background: #3498db; }
        .btn-orale { background: #e74c3c; }
        .btn-scrittura.attiva,
        .btn-orale.attiva {
            box-shadow: 0 0 0 3px rgba(0, 0, 0, .2);
        }
        .modalita-label {
            padding: 4px 14px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 20px;
        }
        .parliamone-card {
            margin-bottom: 20px;
            padding: 16px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
        }
        .parliamone-card .domanda {
            margin-bottom: 12px;
            color: var(--primary-color, #1a6e3a);
            font-weight: 600;
        }
        .parliamone-form {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .parliamone-form input {
            flex: 1;
            min-width: 200px;
            padding: 10px 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        .parliamone-form button,
        .parliamone-riapri button {
            background: var(--primary-color, #1a6e3a);
        }
        .parliamone-mia-risposta {
            margin-top: 10px;
            padding: 12px 16px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
        }
        .parliamone-stato { margin-top: 6px; }
        .parliamone-stato.approvata { color: #168a2f; }
        .parliamone-stato.in_attesa { color: #8a6d3b; }
        .parliamone-stato.da_modificare { color: #b26a00; }
        .parliamone-suggerimento {
            margin-top: 8px;
            padding: 8px 12px;
            background: #fff7e6;
            border-left: 4px solid #f0ad4e;
            border-radius: 6px;
        }
        .parliamone-msg-orale {
            display: none;
            margin: 10px 0;
            padding: 12px 16px;
            background: #fff3cd;
            border: 1px solid #f1c40f;
            border-radius: 8px;
            color: #856404;
        }
        .parliamone-msg-orale.visibile { display: block; }
        .parliamone-docente-panel {
            margin-top: 12px;
            padding: 12px 16px;
            background: #fff8e1;
            border: 1px solid #f1c40f;
            border-radius: 8px;
        }
        .parliamone-docente-panel .titolo {
            margin-bottom: 8px;
            color: #6b5300;
            font-weight: 700;
        }
        .parliamone-risposta-item {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #f0e8d0;
        }
        .parliamone-risposta-item:last-child { border-bottom: none; }
        .parliamone-risposta-item .studente { font-weight: 600; }
        .parliamone-azioni { display: flex; flex-wrap: wrap; gap: 6px; }
        .btn-approva { background: #168a2f; }
        .btn-modifica { background: #f0ad4e; }
        .btn-elimina { background: #e74c3c; }
        .parliamone-vuoto { color: #999; font-style: italic; }

        @media (max-width: 600px) {
            .parliamone-regia { flex-direction: column; }
            .parliamone-form { flex-direction: column; }
            .parliamone-form input { min-width: 100%; }
            .parliamone-form button { width: 100%; }
            .parliamone-risposta-item {
                flex-direction: column;
                align-items: stretch;
            }
        }
    `;

    document.head.appendChild(style);
}

export function generaParliamoneInsieme(dati, isDocente = false) {
    iniettaCss();

    if (!dati?.esercizi?.length) return "";

    const mostraRegia =
        dati.mostraRegia === true ||
        dati.titolo === "💬 Parliamone insieme";

    return `
        <div class="parliamone-container">
            <h3>${dati.titolo || "💬 Parliamone insieme"}</h3>

            ${dati.istruzioni
                ? `<p class="scheda-istruzioni">${dati.istruzioni}</p>`
                : ""}

            ${mostraRegia && isDocente ? `
                <div class="parliamone-regia">
                    <strong>🎛️ Regia Docente</strong>

                    <button class="btn-scrittura attiva"
                        onclick="window.impostaModalitaParliamone('scrittura')">
                        ✍️ Modalità Scrittura
                    </button>

                    <button class="btn-orale"
                        onclick="window.impostaModalitaParliamone('orale')">
                        🗣️ Modalità Orale
                    </button>

                    <span class="modalita-label">📝 Scrittura</span>
                </div>
            ` : ""}

            ${dati.esercizi.map((esercizio, indice) => `
                <div class="parliamone-card" id="card_${esercizio.id}">
                    <div class="domanda">
                        ${indice + 1}. ${esercizio.domanda || ""}
                    </div>

                    <div class="parliamone-msg-orale"
                        id="msg_orale_${esercizio.id}">
                        🎤 Modalità Orale – Rispondi a voce usando la domanda come traccia.
                    </div>

                    <div class="parliamone-studente"
                        id="studente_${esercizio.id}">

                        <div class="parliamone-form"
                            id="form_${esercizio.id}"
                            ${isDocente ? 'style="display:none"' : ""}>

                            <input type="text"
                                id="input_parliamone_${esercizio.id}"
                                placeholder="${esercizio.placeholder || "Scrivi qui la tua risposta..."}">

                            <button onclick="window.inviaRispostaParliamone('${esercizio.id}')">
                                Invia
                            </button>
                        </div>

                        <div class="parliamone-mia-risposta"
                            id="risposta_${esercizio.id}">
                        </div>

                        <div class="parliamone-stato"
                            id="stato_${esercizio.id}">
                        </div>

                        <div class="parliamone-suggerimento"
                            id="suggerimento_${esercizio.id}"
                            style="display:none">
                        </div>

                        <div class="parliamone-riapri"
                            id="riapri_${esercizio.id}"
                            style="display:none">
                            <button onclick="window.riapriInputParliamone('${esercizio.id}')">
                                ✏️ Modifica la risposta
                            </button>
                        </div>
                    </div>

                    ${isDocente ? `
                        <div class="parliamone-docente-panel">
                            <div class="titolo">👨‍🏫 Pannello Docente</div>
                            <div id="docente_lista_${esercizio.id}">
                                <div class="parliamone-vuoto">
                                    In attesa delle risposte degli studenti...
                                </div>
                            </div>
                        </div>
                    ` : ""}
                </div>
            `).join("")}
        </div>
    `;
}

export function initParliamoneInsieme(app) {
    db = getDatabase(app);
}

export function avviaParliamoneInsiemeListener(
    basePath,
    esercizi,
    isDocente = false,
    username = ""
) {
    if (!db) {
        console.warn("Database non inizializzato.");
        return;
    }

    const eserciziValidi = (esercizi || []).filter(esercizio => esercizio?.id);

    eserciziValidi.forEach(esercizio => {
        const id = esercizio.id;
        const chiave = `${basePath}::${id}`;

        let contesto = contesti.get(chiave);

        if (!contesto) {
            contesto = {
                basePath,
                id,
                esercizio,
                isDocente,
                username
            };

            contesti.set(chiave, contesto);

            const risposteRef = ref(
                db,
                `${basePath}/parliamoneInsieme/${id}/risposte`
            );

            onValue(risposteRef, snapshot => {
                aggiornaUIEsercizio(
                    contesto,
                    snapshot.val() || {}
                );
            });
        } else {
            // Aggiorna il ruolo se la stessa scheda viene inizializzata
            // prima come studente e poi come docente.
            contesto.isDocente = contesto.isDocente || isDocente;
            if (username) contesto.username = username;
        }
    });

    if (!modalitaListener.has(basePath)) {
        const modalitaRef = ref(
            db,
            `${basePath}/system/modalita_parliamoneInsieme`
        );

        const callback = snapshot => {
            modalitaCorrente = snapshot.val() || "scrittura";
            aggiornaModalitaUI();

            contesti.forEach(contesto => {
                if (contesto.basePath === basePath) {
                    aggiornaUIEsercizio(contesto, null, true);
                }
            });
        };

        onValue(modalitaRef, callback);
        modalitaListener.set(basePath, callback);
    }
}

function aggiornaModalitaUI() {
    document.querySelectorAll(".btn-scrittura").forEach(button => {
        button.classList.toggle(
            "attiva",
            modalitaCorrente === "scrittura"
        );
    });

    document.querySelectorAll(".btn-orale").forEach(button => {
        button.classList.toggle(
            "attiva",
            modalitaCorrente === "orale"
        );
    });

    document.querySelectorAll(".modalita-label").forEach(label => {
        label.textContent =
            modalitaCorrente === "scrittura"
                ? "📝 Scrittura"
                : "🎤 Orale";
    });
}

function aggiornaUIEsercizio(
    contesto,
    dati = null,
    soloModalita = false
) {
    const {
        id,
        isDocente,
        username
    } = contesto;

    const studenteEl = document.getElementById(`studente_${id}`);
    const formEl = document.getElementById(`form_${id}`);
    const msgOrale = document.getElementById(`msg_orale_${id}`);
    const statoEl = document.getElementById(`stato_${id}`);
    const rispostaEl = document.getElementById(`risposta_${id}`);
    const suggerimentoEl = document.getElementById(`suggerimento_${id}`);
    const docenteLista = document.getElementById(`docente_lista_${id}`);

    const isOrale = modalitaCorrente === "orale";

    if (studenteEl) {
        studenteEl.style.display = isOrale ? "none" : "block";
    }

    if (msgOrale) {
        msgOrale.classList.toggle(
            "visibile",
            isOrale && !isDocente
        );
    }

    if (soloModalita) return;

    const miaRisposta = username && dati
        ? dati[username] || null
        : null;

    if (rispostaEl && statoEl && suggerimentoEl) {
        if (!miaRisposta) {
            rispostaEl.textContent = "";
            statoEl.textContent = isOrale
                ? ""
                : "Scrivi una risposta...";
            statoEl.className = "parliamone-stato";
            suggerimentoEl.textContent = "";
            suggerimentoEl.style.display = "none";

            if (formEl && !isOrale && !isDocente) {
                formEl.style.display = "flex";
            }
        } else {
            rispostaEl.textContent =
                `${miaRisposta.testo || ""}`;

            const stato = miaRisposta.stato || "in_attesa";

            statoEl.textContent =
                stato === "approvata"
                    ? "✅ Approvata!"
                    : stato === "da_modificare"
                        ? "✏️ Da modificare"
                        : "⏳ In attesa di correzione...";

            statoEl.className = `parliamone-stato ${stato}`;

            if (miaRisposta.suggerimento) {
                suggerimentoEl.textContent =
                    `💡 ${miaRisposta.suggerimento}`;
                suggerimentoEl.style.display = "block";
            } else {
                suggerimentoEl.textContent = "";
                suggerimentoEl.style.display = "none";
            }

            if (formEl && !isDocente) {
                formEl.style.display =
                    stato === "da_modificare" && !isOrale
                        ? "flex"
                        : "none";
            }

            const input = document.getElementById(
                `input_parliamone_${id}`
            );

            if (input && stato === "da_modificare") {
                input.value = miaRisposta.testo || "";
            }
        }
    }

    // Questo pannello viene aggiornato anche in modalità orale.
    if (docenteLista && isDocente) {
        const studenti = Object.keys(dati || {});

        if (!studenti.length) {
            docenteLista.innerHTML = `
                <div class="parliamone-vuoto">
                    In attesa delle risposte degli studenti...
                </div>
            `;
            return;
        }

        docenteLista.innerHTML = studenti.map(nome => {
            const risposta = dati[nome] || {};
            const stato = risposta.stato || "in_attesa";
            const icona =
                stato === "approvata"
                    ? "🟢"
                    : stato === "da_modificare"
                        ? "🟡"
                        : "⏳";

            const nomeSicuro = String(nome)
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'");

            return `
                <div class="parliamone-risposta-item">
                    <div>
                        <span class="studente">${nome}:</span>
                        <span>${risposta.testo || ""}</span>
                        <span>${icona}</span>

                        ${risposta.suggerimento ? `
                            <div style="font-size:.85rem;color:#b26a00">
                                💡 ${risposta.suggerimento}
                            </div>
                        ` : ""}
                    </div>

                    <div class="parliamone-azioni">
                        <button class="btn-approva"
                            onclick="window.approvaRispostaParliamone('${id}','${nomeSicuro}')">
                            Approva
                        </button>

                        <button class="btn-modifica"
                            onclick="window.richiediModificaRispostaParliamone('${id}','${nomeSicuro}')">
                            Modifica
                        </button>

                        <button class="btn-elimina"
                            onclick="window.eliminaRispostaParliamone('${id}','${nomeSicuro}')">
                            Elimina
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }
}

function trovaContesto(id) {
    return [...contesti.values()].find(
        contesto => contesto.id === id
    );
}

window.inviaRispostaParliamone = async function(id) {
    const contesto = trovaContesto(id);

    if (!db || !contesto?.username) {
        alert("Errore: non sei connesso.");
        return;
    }

    if (modalitaCorrente === "orale") {
        alert("📢 Modalità Orale attiva! Rispondi a voce.");
        return;
    }

    const input = document.getElementById(`input_parliamone_${id}`);
    if (!input) return;

    const testo = input.value.trim();

    if (!testo) {
        alert("Scrivi una risposta!");
        return;
    }

    const rispostaRef = ref(
        db,
        `${contesto.basePath}/parliamoneInsieme/${id}/risposte/${contesto.username}`
    );

    await set(rispostaRef, {
        testo,
        stato: "in_attesa",
        suggerimento: "",
        timestamp: Date.now()
    });

    input.value = "";
};

window.riapriInputParliamone = function(id) {
    if (modalitaCorrente === "orale") return;

    const form = document.getElementById(`form_${id}`);
    const input = document.getElementById(`input_parliamone_${id}`);

    if (form) form.style.display = "flex";
    if (input) input.focus();
};

function riferimentoRisposta(id, nome) {
    const contesto = trovaContesto(id);

    if (!contesto) return null;

    return ref(
        db,
        `${contesto.basePath}/parliamoneInsieme/${id}/risposte/${nome}`
    );
}

window.approvaRispostaParliamone = async function(id, nome) {
    const contesto = trovaContesto(id);
    const rispostaRef = riferimentoRisposta(id, nome);

    if (!contesto?.isDocente || !rispostaRef) return;

    await update(rispostaRef, {
        stato: "approvata",
        suggerimento: "",
        timestamp: Date.now()
    });
};

window.richiediModificaRispostaParliamone = async function(id, nome) {
    const contesto = trovaContesto(id);
    const rispostaRef = riferimentoRisposta(id, nome);

    if (!contesto?.isDocente || !rispostaRef) return;

    const suggerimento = prompt(
        "✏️ Scrivi un suggerimento per lo studente:"
    );

    if (suggerimento === null) return;

    if (!suggerimento.trim()) {
        alert("Il suggerimento non può essere vuoto.");
        return;
    }

    await update(rispostaRef, {
        stato: "da_modificare",
        suggerimento: suggerimento.trim(),
        timestamp: Date.now()
    });
};

window.eliminaRispostaParliamone = async function(id, nome) {
    const contesto = trovaContesto(id);
    const rispostaRef = riferimentoRisposta(id, nome);

    if (!contesto?.isDocente || !rispostaRef) return;

    if (!confirm(`Eliminare la risposta di ${nome}?`)) return;

    await remove(rispostaRef);
};

window.resettaRisposteParliamone = async function(id) {
    const contesto = trovaContesto(id);

    if (!contesto?.isDocente) return;

    if (!confirm("Resettare tutte le risposte per questo esercizio?")) {
        return;
    }

    await remove(
        ref(
            db,
            `${contesto.basePath}/parliamoneInsieme/${id}`
        )
    );
};

window.impostaModalitaParliamone = async function(modalita) {
    const contestoDocente = [...contesti.values()].find(
        contesto => contesto.isDocente
    );

    if (
        !db ||
        !contestoDocente ||
        !["scrittura", "orale"].includes(modalita)
    ) {
        return;
    }

    await set(
        ref(
            db,
            `${contestoDocente.basePath}/system/modalita_parliamoneInsieme`
        ),
        modalita
    );
};
