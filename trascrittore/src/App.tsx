import { useState, useEffect } from "react";
import { 
  Mic, 
  Upload, 
  Activity, 
  BookOpen, 
  CheckCircle, 
  Languages, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  ArrowLeft,
  Sparkles,
  Award,
  BookMarked,
  Info,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResult, HistorySession } from "./types";
import AudioRecorder from "./components/AudioRecorder";
import AudioUploader from "./components/AudioUploader";
import AnalysisDashboard from "./components/AnalysisDashboard";
import HistoryList from "./components/HistoryList";

export default function App() {
  // Application Parameter States
  const [mode, setMode] = useState<"monologo" | "dialogo">("monologo");
  const [targetLevel, setTargetLevel] = useState<string>("B1");
  const [inputType, setInputType] = useState<"record" | "upload">("record");

  // Captured Audio States
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);

  // Analysis Lifecycle States
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [currentSessionAudio, setCurrentSessionAudio] = useState<{ base64: string; mimeType: string; name: string } | null>(null);

  // History Tracker State
  const [sessions, setSessions] = useState<HistorySession[]>([]);

  const transcribingMessages = [
    "Ricezione e ottimizzazione della traccia audio degli studenti...",
    "Generazione istantanea della trascrizione del parlato...",
    "Allineamento ed elaborazione finale del testo letterale..."
  ];

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("italiano_parlato_sessions");
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (err) {
        console.error("Errore nel caricamento dello storico:", err);
      }
    }
  }, []);

  // Cycle loading messages when analyzing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < transcribingMessages.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Handle incoming captured audio
  const handleAudioReady = (base64Data: string, mimeType: string, fileName: string) => {
    setAudioBase64(base64Data);
    setAudioMimeType(mimeType);
    setAudioName(fileName);
    setApiError(null);
  };

  // Dispatch rapid transcription to backend API
  const startTranscription = async () => {
    if (!audioBase64 || !audioMimeType) return;
    
    setIsLoading(true);
    setApiError(null);
    setActiveResult(null);
    setActiveSessionId(null);
    setCurrentSessionAudio({
      base64: audioBase64,
      mimeType: audioMimeType,
      name: audioName || "Registrazione senza nome"
    });

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioBase64,
          mimeType: audioMimeType
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Errore del server (${response.status})`);
      }

      const resultData = await response.json();
      
      const initialResult: AnalysisResult = {
        transcription: resultData.transcription,
        isDialogue: resultData.isDialogue || (mode === "dialogo"),
        cefrLevelEstimated: "",
        overallFeedback: "",
        metrics: {
          fluency: { score: 0, feedback: "" },
          grammar: { score: 0, feedback: "" },
          vocabulary: { score: 0, feedback: "" },
          pronunciation: { score: 0, feedback: "" }
        },
        errors: [],
        exercises: []
      };

      // Save to History State & LocalStorage
      const newSessionId = Math.random().toString(36).slice(2, 9);
      const newSession: HistorySession = {
        id: newSessionId,
        timestamp: new Date().toISOString(),
        audioName: audioName || "Registrazione senza nome",
        mode: mode,
        targetLevel: targetLevel,
        result: initialResult
      };

      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      localStorage.setItem("italiano_parlato_sessions", JSON.stringify(updatedSessions));

      setActiveResult(initialResult);
      setActiveSessionId(newSessionId);

      // Clean pending audio input state but keep in currentSessionAudio
      setAudioBase64(null);
      setAudioMimeType(null);
      setAudioName(null);

    } catch (err: any) {
      console.error("Errore chiamata API trascrizione:", err);
      setApiError(err.message || "Impossibile collegarsi al server o trascrivere l'audio.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch full detailed analysis to backend API using pre-calculated transcription
  const startDeepAnalysis = async () => {
    const audioData = currentSessionAudio;
    if (!audioData || !activeResult?.transcription) {
      setApiError("Dati audio o trascrizione non disponibili per l'analisi approfondita.");
      return;
    }

    setIsDeepAnalyzing(true);
    setApiError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioData.base64,
          mimeType: audioData.mimeType,
          mode: mode,
          targetLevel: targetLevel,
          preCalculatedTranscription: activeResult.transcription
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Errore del server (${response.status})`);
      }

      const resultData: AnalysisResult = await response.json();

      // Aggiorna lo storico locale e lo stato
      if (activeSessionId) {
        const updatedSessions = sessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              result: resultData
            };
          }
          return s;
        });
        setSessions(updatedSessions);
        localStorage.setItem("italiano_parlato_sessions", JSON.stringify(updatedSessions));
      }

      setActiveResult(resultData);

    } catch (err: any) {
      console.error("Errore chiamata API analisi profonda:", err);
      setApiError(err.message || "Errore durante l'analisi glottodidattica approfondita.");
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  // Load a historical session
  const selectHistorySession = (session: HistorySession) => {
    setActiveResult(session.result);
    setActiveSessionId(session.id);
    setMode(session.mode);
    setTargetLevel(session.targetLevel);
    
    // Clear pending recording
    setAudioBase64(null);
    setAudioMimeType(null);
    setAudioName(null);
    setApiError(null);
  };

  // Delete a session from history
  const deleteHistorySession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem("italiano_parlato_sessions", JSON.stringify(updated));
    
    // If the deleted session was currently open, reset active result
    if (activeSessionId === sessionId) {
      setActiveResult(null);
      setActiveSessionId(null);
    }
  };

  // Clear active dashboard and return to home screen
  const startNewAnalysis = () => {
    setActiveResult(null);
    setActiveSessionId(null);
    setAudioBase64(null);
    setAudioMimeType(null);
    setAudioName(null);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col" id="app-root-container">
      
      {/* Upper Navigation Bar */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 sticky top-0 z-30 shadow-sm" id="main-app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-600/10 shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg md:text-xl font-sans tracking-tight leading-tight">
                ParloItaliano <span className="text-emerald-600 font-medium font-mono text-xs border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">L2</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Auto-correzione parlata per studenti russofoni</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {activeResult && (
              <button
                id="btn-nav-new-analysis"
                onClick={startNewAnalysis}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Nuovo Parlato</span>
              </button>
            )}
            
            <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border text-xs text-slate-600 font-semibold" id="italy-flag-badge">
              <span className="h-3.5 w-3 bg-[#008C45] rounded-l-sm" />
              <span className="h-3.5 w-3 bg-[#F4F5F0]" />
              <span className="h-3.5 w-3 bg-[#CD212A] rounded-r-sm" />
              <span className="ml-1.5 mr-1 text-slate-700">it-ru</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="main-content-grid">
        
        {/* Left/Middle Column: Workspace (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col space-y-6" id="workspace-column">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading State */}
            {isLoading ? (
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6 flex-1 min-h-[420px]"
                id="analysis-loading-screen"
              >
                {/* Pedagogical Spinner */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-24 w-24 rounded-full border-4 border-slate-100" />
                  <Loader2 className="h-16 w-16 text-emerald-600 animate-spin relative z-10" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-bold text-slate-900 text-xl font-sans tracking-tight">
                    Analisi del parlato in corso...
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Stiamo inviando l'audio alla nostra Intelligenza Artificiale per l'elaborazione didattica della lingua.
                  </p>
                </div>

                {/* Progressive reassuring loading message */}
                <div className="bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-100 max-w-sm w-full font-medium text-emerald-800 text-xs flex items-center gap-2 justify-center shadow-inner" id="loading-progress-box">
                  <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
                  <span className="animate-fade-in transition-all duration-300">
                    {transcribingMessages[loadingStep]}
                  </span>
                </div>
              </motion.div>
            ) : activeResult ? (
              
              /* 2. Dashboard Result State */
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Back button link above dashboard */}
                <button
                  id="btn-back-home"
                  onClick={startNewAnalysis}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors self-start"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Torna all'inserimento audio</span>
                </button>

                <AnalysisDashboard 
                  result={activeResult} 
                  onStartDeepAnalysis={startDeepAnalysis} 
                  isDeepAnalyzing={isDeepAnalyzing} 
                />
              </motion.div>
            ) : (
              
              /* 3. Input Audio Choice State (Home) */
              <motion.div
                key="input-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Welcome Pitch */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase border border-emerald-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Lancia il tuo parlato italiano</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Migliora la tua fluidità orale con l'autovalutazione mirata
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base max-w-xl">
                    Registra o carica un audio in italiano. Analizzeremo la trascrizione identificando gli errori grammaticali e fonetici causati dall'influenza della tua lingua madre russa, fornendoti esercizi su misura per migliorare.
                  </p>
                </div>

                {/* API Key warning guard if missing */}
                {apiError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3" id="api-execution-error">
                    <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Errore di analisi:</p>
                      <p className="mt-0.5">{apiError}</p>
                    </div>
                  </div>
                )}

                {/* Setup Student Target Metrics Block */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6" id="student-parameters-card">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <BookMarked className="h-4 w-4 text-emerald-600" />
                    Imposta i parametri della sessione
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Level Selector */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                        Livello QCER Target:
                      </label>
                      <div className="grid grid-cols-3 gap-2" id="qcer-selector">
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                          <button
                            key={lvl}
                            id={`btn-qcer-${lvl}`}
                            onClick={() => setTargetLevel(lvl)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                              targetLevel === lvl
                                ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">
                        Stabilisce il metro di severità e la difficoltà degli esercizi generati.
                      </span>
                    </div>

                    {/* Mode Selector */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                        Modalità Parlato:
                      </label>
                      <div className="flex gap-3" id="mode-selector">
                        <button
                          id="btn-mode-monologue"
                          onClick={() => setMode("monologo")}
                          className={`flex-1 py-3 px-4 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            mode === "monologo"
                              ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Mic className="h-4 w-4" />
                          <span>Monologo</span>
                        </button>

                        <button
                          id="btn-mode-dialogue"
                          onClick={() => setMode("dialogo")}
                          className={`flex-1 py-3 px-4 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            mode === "dialogo"
                              ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Languages className="h-4 w-4" />
                          <span>Dialogo (Studenti)</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">
                        Usa monologo per parlare da solo, o dialogo se sei in coppia con un altro studente.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input Card Container */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6" id="input-methods-card">
                  {/* Selector Header tabs */}
                  <div className="flex border-b border-slate-100 pb-3 gap-2" id="input-tabs">
                    <button
                      id="btn-tab-record"
                      onClick={() => {
                        setInputType("record");
                        setAudioBase64(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        inputType === "record"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>Registra Audio</span>
                    </button>

                    <button
                      id="btn-tab-upload"
                      onClick={() => {
                        setInputType("upload");
                        setAudioBase64(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        inputType === "upload"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Carica File Audio</span>
                    </button>
                  </div>

                  {/* Render Selected Input Element */}
                  <div id="active-input-element-container">
                    {inputType === "record" ? (
                      <AudioRecorder onAudioReady={handleAudioReady} />
                    ) : (
                      <AudioUploader onAudioReady={handleAudioReady} />
                    )}
                  </div>

                  {/* Submit Bar */}
                  {audioBase64 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                      id="submit-analysis-bar"
                    >
                      <div className="text-left text-slate-500 text-xs w-full sm:w-auto">
                        <span className="font-semibold text-slate-700 block">Audio pronto per l'analisi:</span>
                        <span className="font-mono mt-0.5 truncate block max-w-xs">{audioName}</span>
                      </div>

                      <button
                        id="btn-dispatch-analysis"
                        onClick={startTranscription}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center space-x-2"
                      >
                        <Sparkles className="h-4.5 w-4.5" />
                        <span>Trascrivi Immediatamente</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-6" id="history-column">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
                Diario di Bordo
              </h3>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                Riascolta le tue precedenti esercitazioni ed esamina i progressi compiuti e gli errori già compresi.
              </p>
            </div>

            <HistoryList
              sessions={sessions}
              onSelectSession={selectHistorySession}
              onDeleteSession={deleteHistorySession}
              activeSessionId={activeSessionId}
            />
          </div>

          {/* Educational Insights / Contrasts box */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-100 rounded-3xl p-6 space-y-4 shadow-md">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-white">
              <Info className="h-4 w-4 text-emerald-300" />
              Focus Contrasti: It-Ru
            </h4>
            <div className="text-xs space-y-3 opacity-90 leading-relaxed">
              <p>
                <strong>Articoli Determinitativi:</strong> La lingua russa non ha articoli. Ricordati che in italiano l'articolo specifica l'accordo del sostantivo!
              </p>
              <p>
                <strong>Doppie Consonanti:</strong> In russo le consonanti geminate non cambiano il significato delle parole, ma in italiano sì! (es. <em>pena</em> vs <em>penna</em>).
              </p>
              <p>
                <strong>Riduzione Vocalica:</strong> Attenzione alla "O" atona che in russo si pronuncia "A" (akan'e). In italiano, le vocali finali mantengono sempre il loro suono originario!
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-slate-400 text-xs mt-auto" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ParloItaliano L2. Tutti i diritti riservati.</p>
          <p className="text-slate-400 font-medium">Metodologia basata sul Quadro Comune Europeo (QCER)</p>
        </div>
      </footer>
    </div>
  );
}
