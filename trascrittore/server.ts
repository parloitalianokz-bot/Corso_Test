import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize Gemini client so it doesn't crash on startup if GEMINI_API_KEY is not yet configured.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY non configurata. Impostala nel pannello Secrets di AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function generateContentWithRetry(client: GoogleGenAI, params: any, maxRetries = 3) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`Tentativo generazione con modello ${modelName} (tentativo ${attempt + 1}/${maxRetries})...`);
        const response = await client.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
        const errMsg = error.message || errStr || "";
        const errCode = error.status || error.code || 0;
        
        console.warn(`Errore con ${modelName} (tentativo ${attempt + 1}):`, errMsg);

        // Check if it's a retriable error (503, 429, UNAVAILABLE, etc.)
        const isRetriable = 
          errStr.includes("503") || 
          errStr.includes("429") || 
          errStr.includes("demand") || 
          errStr.includes("UNAVAILABLE") || 
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("503") || 
          errMsg.includes("429") || 
          errMsg.includes("demand") || 
          errMsg.includes("UNAVAILABLE") || 
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errCode === 503 ||
          errCode === 429;

        if (isRetriable && attempt < maxRetries - 1) {
          attempt++;
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.log(`Attesa di ${Math.round(delay)}ms prima del prossimo tentativo...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // If not retriable or we exhausted retries for this model, log the model switch and break
          if (i < modelsToTry.length - 1) {
            console.warn(`Modello ${modelName} fallito o non riprovabile. Passaggio al modello successivo: ${modelsToTry[i + 1]}`);
          }
          break;
        }
      }
    }
  }

  throw lastError || new Error("Generazione fallita con tutti i modelli disponibili.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure body limit to handle large audio base64 uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API endpoint for fast audio transcription
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audio, mimeType, mode } = req.body;

      if (!audio) {
        return res.status(400).json({ error: "File audio mancante o non valido per la trascrizione." });
      }

      const client = getGeminiClient();

      const audioPart = {
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audio,
        },
      };

      const systemInstruction = `Sei un esperto trascrittore di Italiano L2, specializzato nell'ascolto e corretta interpretazione di parlanti con accento russo o influenze della lingua russa.
Il tuo unico compito è generare una trascrizione letterale (verbatim) estremamente fedele dell'audio in lingua italiana.
Conserva anche incertezze, ripetizioni, esitazioni o errori di pronuncia significativi (es. se dicono parole storpiate, cerca di trascrivere fedelmente quello che dicono).
Se si tratta di un dialogo, dividi chiaramente i parlanti (es. 'Studente A:', 'Studente B:').
Devi rispondere ESCLUSIVAMENTE in formato JSON valido rispettando la struttura indicata nel responseSchema.`;

      const prompt = `Trascrivi fedelmente questo file audio in italiano. 
La modalità dell'audio è: ${mode || "monologo"}.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          transcription: { 
            type: Type.STRING, 
            description: "La trascrizione letterale fedele in italiano, formattata con paragrafi ed eventuali indicazioni dei parlanti (es: 'Studente A:', 'Studente B:') se si tratta di un dialogo." 
          },
          isDialogue: { 
            type: Type.BOOLEAN, 
            description: "True se l'audio è chiaramente un dialogo o interazione tra più persone, False se si tratta di un monologo." 
          }
        },
        required: ["transcription", "isDialogue"]
      };

      const response = await generateContentWithRetry(client, {
        contents: [
          audioPart,
          { text: prompt }
        ],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gemini ha restituito un risultato vuoto per la trascrizione.");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);

    } catch (error: any) {
      console.error("Errore durante la trascrizione dell'audio:", error);
      res.status(500).json({ 
        error: error.message || "Si è verificato un errore durante la trascrizione rapida dell'audio." 
      });
    }
  });

  // API endpoint for deep audio analysis (supports direct analysis or text-aided analysis)
  app.post("/api/analyze", async (req, res) => {
    try {
      const { audio, mimeType, mode, targetLevel, preCalculatedTranscription } = req.body;

      if (!audio) {
        return res.status(400).json({ error: "File audio mancante o non valido." });
      }

      const client = getGeminiClient();

      const audioPart = {
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audio,
        },
      };

      const systemInstruction = `Sei un esperto glottodidatta e docente di Italiano per Stranieri (ILS) specializzato nell'insegnamento a studenti russofoni.
Il tuo compito è ascoltare e analizzare un file audio contenente un monologo o un dialogo di studenti russofoni di italiano${preCalculatedTranscription ? `, facendo riferimento alla trascrizione pre-calcolata fornita` : ""}.
Fornisci:
1. Una trascrizione letterale (verbatim) accurata dell'audio in italiano (puoi riutilizzare o rifinire quella fornita se presente). Se è un dialogo, dividi chiaramente i parlanti (es. 'Studente A:', 'Studente B:').
2. Una stima accurata del livello di competenza linguistica basata sul Quadro Comune Europeo di Riferimento per le Lingue (QCER: A1, A2, B1, B2, C1, C2).
3. Un'analisi approfondita delle prestazioni divisa in 4 metriche (Fluidità, Grammatica, Lessico, Pronuncia) con punteggio da 1 a 5 e commenti mirati per discenti russofoni.
4. Un elenco degli errori più comuni evidenziando le cause tipiche di interferenza linguistica russo-italiano (es. omissione o uso errato degli articoli, confusione nelle preposizioni 'a/in/da', assenza di doppie consonanti nella fonetica russa, riduzione vocalica russa o 'akan'e/okan'e' che altera le desinenze italiane, calchi lessicali dal russo).
5. Tre esercizi interattivi mirati (scelta tra: completamento 'fill_in_the_blank', pratica di pronuncia 'pronunciation_drill', trasformazione frasi 'sentence_transformation') per aiutare lo studente a superare le difficoltà riscontrate in questo specifico audio.

Devi rispondere ESCLUSIVAMENTE in formato JSON valido rispettando la struttura indicata nel responseSchema.`;

      let prompt = `Analizza questo file audio registrato da uno studente russofono (o più studenti) che parla in italiano.
La modalità dell'audio è: ${mode || "monologo"}.
${targetLevel ? `Il livello QCER target dichiarato dallo studente è: ${targetLevel}.` : ""}`;

      if (preCalculatedTranscription) {
        prompt += `\nUsa questa trascrizione già calcolata per concentrarti sull'analisi strutturale e pedagogica e velocizzare l'identificazione degli errori:
"""
${preCalculatedTranscription}
"""`;
      }

      prompt += `\nFornisci la trascrizione finale accurata ed evidenzia gli errori tipici causati dall'influenza della lingua russa (interferenza fonetica, morfologica, sintattica o lessicale), fornendo correzioni precise, spiegazioni pedagogiche incoraggianti e 3 esercizi mirati completi di domande e risposte corrette.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          transcription: { 
            type: Type.STRING, 
            description: "La trascrizione letterale in italiano, formattata con paragrafi ed eventuali indicazioni dei parlanti (es: 'Studente A:', 'Studente B:') se si tratta di un dialogo." 
          },
          isDialogue: { 
            type: Type.BOOLEAN, 
            description: "True se l'audio è un dialogo o interazione tra più studenti, False se è un monologo." 
          },
          cefrLevelEstimated: { 
            type: Type.STRING, 
            description: "Livello QCER complessivo stimato del parlato (A1, A2, B1, B2, C1, C2)." 
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              fluency: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: "Punteggio di fluidità da 1 a 5." },
                  feedback: { type: Type.STRING, description: "Feedback dettagliato sulla fluidità, pause, ritmo e spontaneità." }
                },
                required: ["score", "feedback"]
              },
              grammar: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: "Punteggio di accuratezza grammaticale da 1 a 5." },
                  feedback: { type: Type.STRING, description: "Feedback sull'uso delle regole grammaticali, coniugazioni, accordi di genere/numero." }
                },
                required: ["score", "feedback"]
              },
              vocabulary: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: "Punteggio di ricchezza lessicale da 1 a 5." },
                  feedback: { type: Type.STRING, description: "Feedback sull'appropriatezza terminologica, idiomi e presenza di calchi letterali dal russo." }
                },
                required: ["score", "feedback"]
              },
              pronunciation: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: "Punteggio di pronuncia e intonazione da 1 a 5." },
                  feedback: { type: Type.STRING, description: "Feedback sulla fonetica, in particolare su doppie consonanti, pronuncia delle vocali (evitando la riduzione russa), 'c/g' dolci e dure, sibilanti e intonazione complessiva." }
                },
                required: ["score", "feedback"]
              }
            },
            required: ["fluency", "grammar", "vocabulary", "pronunciation"]
          },
          errors: {
            type: Type.ARRAY,
            description: "Un array contenente i principali errori evidenziati nel parlato.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                original: { type: Type.STRING, description: "Il frammento o parola errata così come pronunciata o scritta." },
                corrected: { type: Type.STRING, description: "La versione corretta in buon italiano." },
                explanation: { type: Type.STRING, description: "Spiegazione chiara delle ragioni dell'errore, con enfasi sull'interferenza linguistica russa se presente." },
                category: { type: Type.STRING, description: "Scegliere esattamente una delle seguenti categorie: 'grammatica', 'lessico', 'fonetica', 'sintassi'." },
                cefrLevel: { type: Type.STRING, description: "Livello QCER indicativo associato alla regola violata (A1, A2, B1, B2, C1, C2)." },
                severity: { type: Type.STRING, description: "Gravità dell'errore ai fini dell'efficacia comunicativa. Scegliere esattamente tra: 'lieve', 'medio', 'grave'." }
              },
              required: ["id", "original", "corrected", "explanation", "category", "cefrLevel", "severity"]
            }
          },
          exercises: {
            type: Type.ARRAY,
            description: "Un set di esattamente 3 esercizi mirati basati sulle lacune rilevate nell'audio.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Titolo dell'esercizio." },
                description: { type: Type.STRING, description: "Obiettivo didattico (es: 'Uso corretto delle preposizioni', 'Distinguere singole e doppie')." },
                type: { type: Type.STRING, description: "Tipo di esercizio. Scegliere esattamente tra: 'fill_in_the_blank', 'pronunciation_drill', 'sentence_transformation'." },
                instructions: { type: Type.STRING, description: "Spiegazione in italiano su come lo studente deve completare l'attività." },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING, description: "La domanda, la frase incompleta (es: 'Vado ___ Italia [in/a]') o la parola/frase da pronunciare." },
                      correctAnswer: { type: Type.STRING, description: "La risposta corretta attesa o la corretta realizzazione fonetica di riferimento." },
                      hint: { type: Type.STRING, description: "Un indizio didattico." }
                    },
                    required: ["question", "correctAnswer"]
                  }
                }
              },
              required: ["title", "description", "type", "instructions", "items"]
            }
          },
          overallFeedback: { 
            type: Type.STRING, 
            description: "Un testo finale complessivo, pedagogico ed incoraggiante, con consigli pratici per lo studio futuro." 
          }
        },
        required: [
          "transcription", 
          "isDialogue", 
          "cefrLevelEstimated", 
          "metrics", 
          "errors", 
          "exercises", 
          "overallFeedback"
        ]
      };

      const response = await generateContentWithRetry(client, {
        contents: [
          audioPart,
          { text: prompt }
        ],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gemini ha restituito un risultato vuoto.");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);

    } catch (error: any) {
      console.error("Errore durante l'analisi dell'audio:", error);
      res.status(500).json({ 
        error: error.message || "Si è verificato un errore interno durante l'elaborazione del file audio." 
      });
    }
  });

  // Serve static assets and configure SPA fallback depending on production status
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
