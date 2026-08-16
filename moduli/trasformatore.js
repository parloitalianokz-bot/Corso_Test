// Modulo universale per attività input → trasformazione → output.

const ModuloTrasformatore = {
    inserisciStili() {
        if (document.getElementById("stili-trasformatore")) return;

        const stile = document.createElement("style");
        stile.id = "stili-trasformatore";

        stile.textContent = `
            .card-trasformatore {
                margin-top: 8px;
                padding: 22px;
                background: var(--white, #ffffff);
                border: 1px solid rgba(26, 110, 58, 0.16);
                border-radius: 14px;
                box-shadow: 0 5px 16px rgba(0, 0, 0, 0.06);
            }

            .card-trasformatore .header-attivita {
                margin-bottom: 20px;
                text-align: center;
            }

            .card-trasformatore .header-attivita h3 {
                margin: 0 0 8px;
                color: var(--primary-color, #1a6e3a);
                font-size: 1.25rem;
            }

            .card-trasformatore .istruzioni {
                margin: 0;
                color: var(--text-color, #1a1a2e);
                line-height: 1.5;
            }

            .card-trasformatore .area-input-output {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: end;
                gap: 16px;
            }

            .card-trasformatore .campo-group {
                display: flex;
                flex-direction: column;
                gap: 7px;
            }

            .card-trasformatore .campo-group label {
                color: var(--primary-color, #1a6e3a);
                font-weight: 700;
                font-size: 0.95rem;
            }

            .card-trasformatore input,
            .card-trasformatore .box-output {
                width: 100%;
                min-height: 46px;
                box-sizing: border-box;
                padding: 10px 12px;
                border: 1px solid #cfd8d2;
                border-radius: 8px;
                font: inherit;
            }

            .card-trasformatore input {
                background: #fff;
                color: var(--text-color, #1a1a2e);
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }

            .card-trasformatore input:focus {
                border-color: var(--primary-color, #1a6e3a);
                box-shadow: 0 0 0 3px rgba(26, 110, 58, 0.12);
            }

            .card-trasformatore .box-output {
                display: flex;
                align-items: center;
                background: #f4f8f4;
                color: var(--primary-color, #1a6e3a);
                font-weight: 600;
            }

            .card-trasformatore .trasformazione-freccia {
                padding-bottom: 12px;
                color: var(--secondary-color, #ce2b37);
                font-size: 1.5rem;
                font-weight: 700;
            }

            .card-trasformatore .messaggio-errore {
                margin-top: 12px;
                padding: 9px 12px;
                border-left: 4px solid var(--secondary-color, #ce2b37);
                border-radius: 6px;
                background: #fff4f4;
                color: #a51f29;
                font-size: 0.92rem;
            }

            .card-trasformatore .btn-invio {
                display: block;
                width: 100%;
                margin-top: 18px;
                padding: 11px 16px;
                border: none;
                border-radius: 8px;
                background: var(--primary-color, #1a6e3a);
                color: var(--white, #ffffff);
                font: inherit;
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.2s ease, transform 0.2s ease;
            }

            .card-trasformatore .btn-invio:hover:not(:disabled) {
                background: #14582e;
                transform: translateY(-1px);
            }

            .card-trasformatore .btn-invio:disabled {
                opacity: 0.55;
                cursor: not-allowed;
            }

            .card-trasformatore .divisore {
                margin: 22px 0;
                border: 0;
                border-top: 1px solid rgba(26, 110, 58, 0.14);
            }

            .card-trasformatore .sezione-condivisa h4 {
                margin: 0 0 12px;
                color: var(--primary-color, #1a6e3a);
                font-size: 1.05rem;
            }

            .card-trasformatore .lista-condivisa {
                display: flex;
                flex-direction: column;
                gap: 9px;
            }

            .card-trasformatore .risposta-condivisa {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 11px 13px;
                border: 1px solid rgba(26, 110, 58, 0.12);
                border-radius: 8px;
                background: #fafcf9;
            }

            .card-trasformatore .testo-risposta-condivisa {
                line-height: 1.45;
            }

            .card-trasformatore .testo-risposta-condivisa strong {
                color: var(--primary-color, #1a6e3a);
            }

            .card-trasformatore .empty-state {
                margin: 0;
                padding: 12px;
                border-radius: 8px;
                background: #f7f7f7;
                color: #666;
                text-align: center;
                font-style: italic;
            }

            .card-trasformatore .btn-elimina-risposta {
                flex-shrink: 0;
                padding: 6px 9px;
                border: 1px solid rgba(206, 43, 55, 0.25);
                border-radius: 6px;
                background: #fff4f4;
                color: var(--secondary-color, #ce2b37);
                font: inherit;
                font-size: 0.82rem;
                cursor: pointer;
            }

            .card-trasformatore .btn-elimina-risposta:hover {
                background: var(--secondary-color, #ce2b37);
                color: var(--white, #ffffff);
            }

            @media (max-width: 600px) {
                .card-trasformatore {
                    padding: 16px;
                }

                .card-trasformatore .area-input-output {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }

                .card-trasformatore .trasformazione-freccia {
                    padding: 0;
                    text-align: center;
                    transform: rotate(90deg);
                }

                .card-trasformatore .risposta-condivisa {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .card-trasformatore .btn-elimina-risposta {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(stile);
    },

    init(container, config) {
        this.inserisciStili();

        const card = document.createElement("div");
        card.className = "card-trasformatore";

        card.innerHTML = `
            <div class="header-attivita">
                <h3>${this.esc(config.titolo || "")}</h3>
                <p class="istruzioni">${this.esc(config.istruzioni || "")}</p>
            </div>

            <div class="area-input-output">
                <div class="campo-group">
                    <label for="input-${config.id}">
                        ${this.esc(config.etichettaInput || "Input")}:
                    </label>
                    <input
                        type="${config.tipoInput || "text"}"
                        id="input-${config.id}"
                        placeholder="${this.esc(config.placeholderInput || "")}"
                        autocomplete="off">
                </div>

                <div class="trasformazione-freccia">➔</div>

                <div class="campo-group">
                    <label>
                        ${this.esc(config.etichettaOutput || "Output")}:
                    </label>
                    <div id="output-${config.id}" class="box-output">---</div>
                </div>
            </div>

            <div id="messaggio-errore-${config.id}"
                 class="messaggio-errore"
                 style="display:none;"></div>

            <button id="btn-salva-${config.id}" class="btn-invio" disabled>
                ${this.esc(config.testoBottone || "💾 Salva e Condividi")}
            </button>

            <hr class="divisore">

            <div class="sezione-condivisa">
                <h4>${this.esc(config.titoloCondivisi || "💬 Risposte della classe")}</h4>
                <div id="lista-condivisa-${config.id}" class="lista-condivisa">
                    <p class="empty-state">
                        ${this.esc(config.messaggioVuoto || "Ancora nessuna risposta...")}
                    </p>
                </div>
            </div>
        `;

        container.appendChild(card);
        this.bindEvents(config);
    },

    bindEvents(config) {
        const inputEl = document.getElementById(`input-${config.id}`);
        const outputEl = document.getElementById(`output-${config.id}`);
        const buttonEl = document.getElementById(`btn-salva-${config.id}`);
        const errorEl = document.getElementById(`messaggio-errore-${config.id}`);

        inputEl.addEventListener("input", () => {
            const valore = inputEl.value.trim();

            errorEl.style.display = "none";
            errorEl.textContent = "";

            if (!valore) {
                outputEl.textContent = "---";
                buttonEl.disabled = true;
                return;
            }

            const validazione = this.validaInput(valore, config.validazione);

            if (!validazione.valido) {
                outputEl.textContent = "⚠️";
                buttonEl.disabled = true;
                errorEl.textContent = validazione.messaggio;
                errorEl.style.display = "block";
                return;
            }

            try {
                outputEl.textContent = config.trasforma(valore);
                buttonEl.disabled = false;
            } catch (errore) {
                outputEl.textContent = "⚠️";
                buttonEl.disabled = true;
                errorEl.textContent = "Impossibile trasformare questo valore.";
                errorEl.style.display = "block";
            }
        });

        buttonEl.addEventListener("click", async () => {
            const input = inputEl.value.trim();
            const output = outputEl.textContent;

            const risposta = {
                input,
                output,
                valoreCondiviso: typeof config.valoreCondiviso === "function"
                    ? config.valoreCondiviso(input, output)
                    : output,
                timestamp: new Date().toISOString()
            };

            if (typeof config.onSalva === "function") {
                buttonEl.disabled = true;

                try {
                    await config.onSalva(risposta);
                    buttonEl.textContent = "✅ Salvato!";

                    setTimeout(() => {
                        buttonEl.textContent =
                            config.testoBottone || "💾 Salva e Condividi";
                        buttonEl.disabled = false;
                    }, 2000);
                } catch (errore) {
                    buttonEl.disabled = false;
                    errorEl.textContent = "Errore durante il salvataggio.";
                    errorEl.style.display = "block";
                }
            }
        });
    },

    mostraRisposte(config, risposte) {
        const lista = document.getElementById(`lista-condivisa-${config.id}`);
        if (!lista) return;

        if (!risposte.length) {
            lista.innerHTML = `
                <p class="empty-state">
                    ${this.esc(config.messaggioVuoto || "Ancora nessuna risposta...")}
                </p>
            `;
            return;
        }

        lista.innerHTML = risposte.map(risposta => `
            <div class="risposta-condivisa">
                <div class="testo-risposta-condivisa">
                    <strong>${this.esc(risposta.username || "Studente")}</strong>
                    ha
                    ${this.esc(risposta.valoreCondiviso || risposta.output || "")}
                    anni
                </div>

                ${config.isDocente && risposta._key ? `
                    <button
                        type="button"
                        class="btn-elimina-risposta"
                        data-risposta-key="${this.esc(risposta._key)}"
                        title="Elimina risposta">
                        🗑️ Elimina
                    </button>
                ` : ''}
            </div>
        `).join("");

        if (config.isDocente && typeof config.onElimina === "function") {
            lista.querySelectorAll(".btn-elimina-risposta").forEach(button => {
                button.addEventListener("click", async () => {
                    const key = button.dataset.rispostaKey;
                    const risposta = risposte.find(elemento => elemento._key === key);

                    if (!risposta) return;

                    button.disabled = true;
                    button.textContent = "Eliminazione...";

                    try {
                        await config.onElimina(risposta);
                    } catch (errore) {
                        button.disabled = false;
                        button.textContent = "🗑️ Elimina";
                        alert("Non è stato possibile eliminare la risposta.");
                    }
                });
            });
        }
    },

    validaInput(valore, regole) {
        if (!regole) return { valido: true };

        if (regole.tipo === "numero") {
            const numero = Number(valore);

            if (!Number.isInteger(numero)) {
                return {
                    valido: false,
                    messaggio: "Inserisci un numero intero in cifre."
                };
            }

            if (regole.min !== undefined && numero < regole.min) {
                return {
                    valido: false,
                    messaggio: `L'età deve essere almeno ${regole.min} anni.`
                };
            }

            if (regole.max !== undefined && numero > regole.max) {
                return {
                    valido: false,
                    messaggio: `L'età deve essere al massimo ${regole.max} anni.`
                };
            }
        }

        if (
            Array.isArray(regole.listaAccettabili) &&
            !regole.listaAccettabili.includes(valore.toLowerCase())
        ) {
            return {
                valido: false,
                messaggio: "Valore non presente nella lista degli input previsti."
            };
        }

        return { valido: true };
    },

    esc(valore) {
        return String(valore)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
};

export default ModuloTrasformatore;
export { ModuloTrasformatore };
