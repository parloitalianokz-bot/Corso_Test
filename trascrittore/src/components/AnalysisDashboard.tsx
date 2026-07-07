import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Languages, 
  Zap, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award, 
  Play, 
  RefreshCw, 
  Check, 
  ArrowRight,
  Filter,
  Flame,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResult, GrammarError, Exercise, ExerciseItem } from "../types";

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onSaveToHistory?: () => void;
  onStartDeepAnalysis?: () => void;
  isDeepAnalyzing?: boolean;
}

export default function AnalysisDashboard({ 
  result, 
  onSaveToHistory,
  onStartDeepAnalysis,
  isDeepAnalyzing = false
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<"transcription" | "metrics" | "errors" | "exercises">("transcription");
  
  // State for errors (to allow students to mark as corrected)
  const [errors, setErrors] = useState<GrammarError[]>([]);
  
  // State for interactive exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // State for error filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  
  // State to track scroll to error target
  const [highlightedErrorId, setHighlightedErrorId] = useState<string | null>(null);

  // Sync state with incoming results
  useEffect(() => {
    if (result) {
      setErrors((result.errors || []).map(err => ({ ...err, isSelfCorrected: false })));
      setExercises(result.exercises ? JSON.parse(JSON.stringify(result.exercises)) : []);
    }
  }, [result]);

  // Handle TTS for Italian pronunciation
  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speaking
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "it-IT";
      
      // Attempt to load Italian voices
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v => v.lang.startsWith("it"));
      if (italianVoice) {
        utterance.voice = italianVoice;
      }
      utterance.rate = 0.9; // Slightly slower for language learning clarity
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Sintesi vocale non supportata su questo browser.");
    }
  };

  // Toggle self-corrected state of an error
  const toggleSelfCorrected = (errorId: string) => {
    setErrors(prev => prev.map(err => {
      if (err.id === errorId) {
        return { ...err, isSelfCorrected: !err.isSelfCorrected };
      }
      return err;
    }));
  };

  // Handle exercise answers
  const handleAnswerChange = (exerciseIndex: number, itemIndex: number, val: string) => {
    setExercises(prev => prev.map((ex, exIdx) => {
      if (exIdx === exerciseIndex) {
        const updatedItems = ex.items.map((it, itIdx) => {
          if (itIdx === itemIndex) {
            return { ...it, userAnswer: val };
          }
          return it;
        });
        return { ...ex, items: updatedItems };
      }
      return ex;
    }));
  };

  // Check exercise answer
  const checkAnswer = (exerciseIndex: number, itemIndex: number) => {
    setExercises(prev => prev.map((ex, exIdx) => {
      if (exIdx === exerciseIndex) {
        const updatedItems = ex.items.map((it, itIdx) => {
          if (itIdx === itemIndex) {
            const isCorrect = (it.userAnswer || "").trim().toLowerCase() === it.correctAnswer.trim().toLowerCase();
            return { ...it, checked: true, isCorrect };
          }
          return it;
        });
        return { ...ex, items: updatedItems };
      }
      return ex;
    }));
  };

  // Reset an entire exercise
  const resetExercise = (exerciseIndex: number) => {
    setExercises(prev => prev.map((ex, exIdx) => {
      if (exIdx === exerciseIndex) {
        const updatedItems = ex.items.map(it => {
          return { ...it, userAnswer: "", checked: false, isCorrect: undefined };
        });
        return { ...ex, items: updatedItems };
      }
      return ex;
    }));
  };

  // Quick navigation from transcription highlight to error detail
  const navigateToError = (errorId: string) => {
    setHighlightedErrorId(errorId);
    setActiveTab("errors");
    
    // Give state a moment to switch tabs before scrolling
    setTimeout(() => {
      const el = document.getElementById(`error-card-${errorId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add a temporary pulsing focus ring effect
        el.classList.add("ring-2", "ring-emerald-500", "scale-[1.01]");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-emerald-500", "scale-[1.01]");
        }, 2000);
      }
    }, 100);
  };

  // Highlighting algorithm: wraps erroneous parts of transcription into interactive links
  const renderHighlightedTranscription = () => {
    if (!result.transcription) return <p className="text-slate-500 italic">Nessun testo disponibile.</p>;

    let text = result.transcription;
    if (!result.errors || result.errors.length === 0) {
      return (
        <div className="leading-relaxed text-slate-700 text-base md:text-lg whitespace-pre-wrap font-sans bg-white p-6 rounded-2xl border border-slate-200/80 shadow-inner">
          {text}
        </div>
      );
    }

    const sortedErrors = [...result.errors].sort((a, b) => b.original.length - a.original.length);
    
    // We will do a robust markup generation. To prevent replacing fragments inside other highlights,
    // we use a marker array or split approach. For React, a safe and robust way is to build parts.
    // If the transcription is short, we can match and split.
    interface Token {
      text: string;
      errorId?: string;
    }
    
    let tokens: Token[] = [{ text }];

    sortedErrors.forEach(err => {
      if (!err.original.trim()) return;
      
      const newTokens: Token[] = [];
      tokens.forEach(tok => {
        if (tok.errorId) {
          // Already processed as an error, skip further replacements
          newTokens.push(tok);
          return;
        }

        const parts = tok.text.split(err.original);
        if (parts.length > 1) {
          parts.forEach((part, idx) => {
            if (part) newTokens.push({ text: part });
            if (idx < parts.length - 1) {
              newTokens.push({ text: err.original, errorId: err.id });
            }
          });
        } else {
          newTokens.push(tok);
        }
      });
      tokens = newTokens;
    });

    return (
      <div className="leading-relaxed text-slate-700 text-base md:text-lg whitespace-pre-wrap font-sans bg-white p-6 rounded-2xl border border-slate-200/80 shadow-inner">
        {tokens.map((tok, idx) => {
          if (tok.errorId) {
            const err = (result.errors || []).find(e => e.id === tok.errorId);
            const severityColor = 
              err?.severity === "grave" 
                ? "bg-red-50 text-red-800 border-red-400 hover:bg-red-100" 
                : err?.severity === "medio"
                ? "bg-amber-50 text-amber-800 border-amber-400 hover:bg-amber-100"
                : "bg-purple-50 text-purple-800 border-purple-400 hover:bg-purple-100";

            return (
              <span
                key={idx}
                onClick={() => navigateToError(tok.errorId!)}
                className={`cursor-pointer px-1.5 py-0.5 mx-0.5 rounded border-b-2 font-medium transition-all duration-200 ${severityColor}`}
                title="Clicca per visualizzare la spiegazione e autocorrezione"
                id={`transcription-highlight-${tok.errorId}`}
              >
                {tok.text}
              </span>
            );
          }
          return <span key={idx}>{tok.text}</span>;
        })}
      </div>
    );
  };

  // Filter errors
  const filteredErrors = errors.filter(err => {
    const matchesCat = filterCategory === "all" || err.category === filterCategory;
    const matchesSev = filterSeverity === "all" || err.severity === filterSeverity;
    return matchesCat && matchesSev;
  });

  const getCEFRBadgeLabel = (lvl: string) => {
    switch (lvl?.toUpperCase()) {
      case "A1": return "A1 • Principiante Contatto";
      case "A2": return "A2 • Principiante Sopravvivenza";
      case "B1": return "B1 • Intermedio Soglia";
      case "B2": return "B2 • Intermedio Progresso";
      case "C1": return "C1 • Avanzato Efficacia";
      case "C2": return "C2 • Avanzato Padronanza";
      default: return lvl || "Livello in rilevamento";
    }
  };

  const hasDeepAnalysis = !!result.errors && result.errors.length > 0;

  const renderDeepAnalysisRequestBanner = () => {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm text-center max-w-2xl mx-auto my-8">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
          <BookOpen className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-slate-900">
            Richiedi l'Analisi Linguistica ed Esercizi!
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            Il nostro sistema analizzerà la tua trascrizione per identificare gli errori grammaticali tipici dei parlanti russofoni, stimare il tuo livello QCER, valutare fluidità, lessico e darti esercizi interattivi personalizzati!
          </p>
        </div>
        <div className="pt-2">
          <button
            id="btn-trigger-deep-analysis"
            onClick={onStartDeepAnalysis}
            disabled={isDeepAnalyzing}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 mx-auto text-base"
          >
            {isDeepAnalyzing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Analisi in corso... (circa 10-15 secondi)</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Analizza Errori ed Esercizi di Rinforzo</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="analysis-dashboard-root">
      
      {/* Header Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold rounded-full text-xs uppercase tracking-wider">
              Analisi di Italiano L2
            </span>
            <span className="text-slate-400 text-sm">•</span>
            <span className="text-slate-300 text-xs">Ideato per russofoni</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
            Cruscotto Autovalutazione
          </h2>
          <p className="text-slate-300 text-sm max-w-xl line-clamp-2 md:line-clamp-none leading-relaxed">
            {result.overallFeedback || "La trascrizione immediata del tuo parlato è pronta! Se desideri un feedback completo su grammatica, pronuncia russa, fluidità e ricevere esercizi mirati, richiedi l'analisi approfondita in basso."}
          </p>
        </div>

        {/* Global CEFR Badge */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0 self-stretch md:self-auto justify-between md:justify-start" id="global-cefr-card">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs uppercase font-medium">Livello QCER</span>
            <h3 className="text-lg font-bold text-emerald-400 whitespace-nowrap">
              {result.cefrLevelEstimated ? getCEFRBadgeLabel(result.cefrLevelEstimated) : "Non analizzato"}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/20">
            {result.cefrLevelEstimated || "-"}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2 bg-white p-1 rounded-2xl border shadow-sm shrink-0" id="dashboard-navigation-tabs">
        <button
          id="tab-transcription"
          onClick={() => setActiveTab("transcription")}
          className={`px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "transcription"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Trascrizione</span>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full text-xs font-bold scale-90">
            {result.isDialogue ? "Dialogo" : "Monologo"}
          </span>
        </button>

        <button
          id="tab-metrics"
          onClick={() => setActiveTab("metrics")}
          className={`px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "metrics"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Competenze</span>
        </button>

        <button
          id="tab-errors"
          onClick={() => setActiveTab("errors")}
          className={`px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "errors"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Analisi Errori</span>
          {errors.filter(e => !e.isSelfCorrected).length > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
              {errors.filter(e => !e.isSelfCorrected).length}
            </span>
          )}
        </button>

        <button
          id="tab-exercises"
          onClick={() => setActiveTab("exercises")}
          className={`px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "exercises"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Esercizi di Rinforzo</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-4" id="dashboard-tab-content">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Transcription Panel */}
          {activeTab === "transcription" && (
            <motion.div
              key="transcription-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    Trascrizione Letterale del Parlato
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Leggi il testo trascritto dal tuo audio. Le parti evidenziate contengono errori comuni: cliccaci sopra per saltare direttamente alla correzione con spiegazione glottodidattica.
                  </p>
                </div>

                {renderHighlightedTranscription()}

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                  <div className="text-slate-600 text-xs leading-relaxed">
                    <p className="font-semibold text-slate-700">Suggerimento di Autocorrezione:</p>
                    Ascolta di nuovo il tuo audio registrato tenendo d'occhio questo testo. Riesci a notare la differenza tra come lo hai pronunciato e la correzione suggerita? Questo esercizio di ascolto attivo è fondamentale per sviluppare la tua consapevolezza fonetica.
                  </div>
                </div>
              </div>
              {!hasDeepAnalysis && renderDeepAnalysisRequestBanner()}
            </motion.div>
          )}

          {/* TAB 2: Metrics Dashboard */}
          {activeTab === "metrics" && (
            <motion.div
              key="metrics-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!hasDeepAnalysis ? (
                renderDeepAnalysisRequestBanner()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Metric 1: Fluency */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Fluidità e Spontaneità</h4>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 font-mono text-sm font-bold rounded-xl border border-amber-200">
                      {result.metrics.fluency.score} / 5
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.metrics.fluency.feedback}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500" 
                    style={{ width: `${(result.metrics.fluency.score / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Grammar */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Accuratezza Grammaticale</h4>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 font-mono text-sm font-bold rounded-xl border border-purple-200">
                      {result.metrics.grammar.score} / 5
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.metrics.grammar.feedback}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full transition-all duration-500" 
                    style={{ width: `${(result.metrics.grammar.score / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Vocabulary */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Languages className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Lessico e Proprietà Linguistica</h4>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-mono text-sm font-bold rounded-xl border border-blue-200">
                      {result.metrics.vocabulary.score} / 5
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.metrics.vocabulary.feedback}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${(result.metrics.vocabulary.score / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Pronunciation */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Pronuncia e Intonazione</h4>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-sm font-bold rounded-xl border border-emerald-200">
                      {result.metrics.pronunciation.score} / 5
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.metrics.pronunciation.feedback}
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${(result.metrics.pronunciation.score / 5) * 100}%` }}
                  />
                </div>
              </div>
              </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Error Analysis & Self-Correction */}
          {activeTab === "errors" && (
            <motion.div
              key="errors-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!hasDeepAnalysis ? (
                renderDeepAnalysisRequestBanner()
              ) : (
                <>
                  {/* Filter Controls */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span>Filtra Errori</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <select
                    id="filter-category-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                  >
                    <option value="all">Tutte le Categorie</option>
                    <option value="grammatica">Grammatica</option>
                    <option value="lessico">Lessico</option>
                    <option value="fonetica">Fonetica / Pronuncia</option>
                    <option value="sintassi">Sintassi</option>
                  </select>

                  {/* Severity Filter */}
                  <select
                    id="filter-severity-select"
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                  >
                    <option value="all">Tutte le Gravità</option>
                    <option value="lieve">Lieve (Non ostacola la comprensione)</option>
                    <option value="medio">Medio</option>
                    <option value="grave">Grave (Rischio incomprensione)</option>
                  </select>
                </div>
              </div>

              {/* Error Cards List */}
              <div className="space-y-4" id="errors-cards-list">
                {filteredErrors.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-lg">Nessun errore trovato</h4>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Non ci sono errori corrispondenti ai filtri attuali. Ottimo lavoro con lo studio della lingua!
                    </p>
                  </div>
                ) : (
                  filteredErrors.map((err) => {
                    const sevStyles = 
                      err.severity === "grave" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : err.severity === "medio"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-purple-50 text-purple-700 border-purple-200";

                    return (
                      <div
                        key={err.id}
                        id={`error-card-${err.id}`}
                        className={`bg-white rounded-3xl p-5 md:p-6 border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
                          err.isSelfCorrected 
                            ? "border-emerald-200/80 opacity-70 bg-emerald-50/10 shadow-sm" 
                            : "border-slate-200 shadow-sm hover:border-slate-300"
                        }`}
                      >
                        {/* Interactive checklist side marker */}
                        {err.isSelfCorrected && (
                          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                        )}

                        <div className="space-y-4 flex-1">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                              {err.category}
                            </span>
                            <span className={`px-2.5 py-0.5 border text-xs font-semibold rounded-full uppercase tracking-wider ${sevStyles}`}>
                              {err.severity}
                            </span>
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                              Target QCER: {err.cefrLevel}
                            </span>
                          </div>

                          {/* Comparative View */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="comparative-block">
                            {/* Original Erroneous Text */}
                            <div className="p-3 bg-red-50/50 border border-red-100 rounded-2xl">
                              <span className="text-xs font-semibold uppercase tracking-wider text-red-500">Come detto dallo studente:</span>
                              <p className="text-red-900 font-medium text-base mt-1 line-through decoration-red-400">
                                "{err.original}"
                              </p>
                            </div>

                            {/* Corrected Text */}
                            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Correzione corretta:</span>
                                <p className="text-emerald-900 font-semibold text-base mt-1">
                                  "{err.corrected}"
                                </p>
                              </div>
                              <button
                                id={`btn-play-tts-${err.id}`}
                                onClick={() => playTTS(err.corrected)}
                                className="self-end p-1 text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center gap-1 text-xs font-medium mt-2 transition-colors"
                                title="Ascolta pronuncia nativa"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                                <span>Ascolta</span>
                              </button>
                            </div>
                          </div>

                          {/* Pedagogical Explanation */}
                          <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Perché è un errore?</span>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {err.explanation}
                            </p>
                          </div>
                        </div>

                        {/* Interactive "Self-Corrected" Checkbox */}
                        <div className="shrink-0 self-stretch md:self-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex items-center justify-between gap-4 md:flex-col md:justify-center">
                          <span className="text-xs font-medium text-slate-500 block md:hidden">Auto-correzione:</span>
                          <button
                            id={`btn-self-correct-${err.id}`}
                            onClick={() => toggleSelfCorrected(err.id)}
                            className={`w-full md:w-auto px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-1.5 border ${
                              err.isSelfCorrected
                                ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                            <span>{err.isSelfCorrected ? "Compreso!" : "Segna come compreso"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              </>
              )}
            </motion.div>
          )}

          {/* TAB 4: Targeted reinforcements */}
          {activeTab === "exercises" && (
            <motion.div
              key="exercises-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!hasDeepAnalysis ? (
                renderDeepAnalysisRequestBanner()
              ) : (
                <>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-start gap-3">
                <Flame className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-emerald-950 text-sm">
                  <p className="font-bold">Esercizi Generati su Misura per Te!</p>
                  <p className="mt-1">
                    Gemini ha creato questi esercizi basandosi esclusivamente sulle lacune riscontrate nella tua registrazione. Risolvili per consolidare le regole e allenare l'autocorrezione.
                  </p>
                </div>
              </div>

              {exercises.length === 0 ? (
                <p className="text-slate-500 italic text-center">Nessun esercizio generato.</p>
              ) : (
                <div className="space-y-8" id="targeted-exercises-list">
                  {exercises.map((ex, exIdx) => (
                    <div 
                      key={exIdx} 
                      className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6"
                      id={`exercise-block-${exIdx}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-full uppercase tracking-wider">
                            Attività {exIdx + 1} • {ex.type.replace(/_/g, " ")}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">{ex.title}</h3>
                          <p className="text-slate-500 text-sm mt-0.5">{ex.description}</p>
                        </div>
                        <button
                          id={`btn-reset-exercise-${exIdx}`}
                          onClick={() => resetExercise(exIdx)}
                          className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Ricomincia</span>
                        </button>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
                        <p className="font-semibold text-slate-800">Istruzioni:</p>
                        <p className="mt-0.5">{ex.instructions}</p>
                      </div>

                      {/* Interactive form container */}
                      <div className="space-y-4" id={`exercise-items-list-${exIdx}`}>
                        {ex.items.map((item, itemIdx) => (
                          <div 
                            key={itemIdx} 
                            className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl space-y-3"
                            id={`exercise-${exIdx}-item-${itemIdx}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <span className="font-mono text-xs text-slate-400">Frase {itemIdx + 1}</span>
                                <p className="font-medium text-slate-800 text-base">
                                  {item.question}
                                </p>
                              </div>
                              {item.checked && (
                                <div className="shrink-0">
                                  {item.isCorrect ? (
                                    <span className="p-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center" title="Corretto!">
                                      <Check className="h-4 w-4" />
                                    </span>
                                  ) : (
                                    <span className="p-1 bg-red-100 text-red-700 rounded-full flex items-center justify-center" title="Sbagliato, riprova!">
                                      <XCircle className="h-4 w-4" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Render interface based on exercise type */}
                            {ex.type === "fill_in_the_blank" && (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <input
                                  id={`input-answer-${exIdx}-${itemIdx}`}
                                  type="text"
                                  placeholder="Scrivi qui la parola..."
                                  value={item.userAnswer || ""}
                                  disabled={item.checked && item.isCorrect}
                                  onChange={(e) => handleAnswerChange(exIdx, itemIdx, e.target.value)}
                                  className={`flex-1 px-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 bg-white ${
                                    item.checked
                                      ? item.isCorrect
                                        ? "border-emerald-300 focus:ring-emerald-500 bg-emerald-50/10 text-emerald-950 font-medium"
                                        : "border-red-300 focus:ring-red-500 bg-red-50/10 text-red-950"
                                      : "border-slate-300 focus:ring-emerald-500 text-slate-800"
                                  }`}
                                />
                                <button
                                  id={`btn-check-answer-${exIdx}-${itemIdx}`}
                                  onClick={() => checkAnswer(exIdx, itemIdx)}
                                  disabled={item.checked && item.isCorrect}
                                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                                >
                                  Verifica
                                </button>
                              </div>
                            )}

                            {ex.type === "pronunciation_drill" && (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100">
                                <div className="text-slate-600 text-sm">
                                  <span className="text-xs uppercase font-semibold text-slate-400 block">Modello di pronuncia:</span>
                                  <p className="font-mono text-emerald-800 font-medium mt-0.5">"{item.correctAnswer}"</p>
                                </div>
                                <button
                                  id={`btn-speak-drill-${exIdx}-${itemIdx}`}
                                  onClick={() => playTTS(item.correctAnswer)}
                                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <Volume2 className="h-4 w-4" />
                                  <span>Ascolta Modello</span>
                                </button>
                              </div>
                            )}

                            {ex.type === "sentence_transformation" && (
                              <div className="space-y-3">
                                <textarea
                                  id={`textarea-answer-${exIdx}-${itemIdx}`}
                                  rows={2}
                                  placeholder="Riscrivi la frase corretta..."
                                  value={item.userAnswer || ""}
                                  onChange={(e) => handleAnswerChange(exIdx, itemIdx, e.target.value)}
                                  className="w-full px-4 py-2 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white text-slate-800"
                                />
                                <div className="flex items-center justify-between gap-4">
                                  <button
                                    id={`btn-compare-${exIdx}-${itemIdx}`}
                                    onClick={() => checkAnswer(exIdx, itemIdx)}
                                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                                  >
                                    Confronta Risposta
                                  </button>
                                  
                                  {item.hint && (
                                    <span className="text-xs text-slate-500 italic flex items-center gap-1">
                                      <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                                      Indizio: {item.hint}
                                    </span>
                                  )}
                                </div>

                                {item.checked && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1 mt-2 text-sm"
                                  >
                                    <span className="text-xs uppercase font-semibold text-emerald-700 block">Risposta corretta di riferimento:</span>
                                    <p className="font-semibold text-slate-800">"{item.correctAnswer}"</p>
                                    <p className="text-xs text-slate-500 mt-1">Confronta la tua risposta con questa. Hai inserito correttamente tutti gli accordi e le doppie?</p>
                                  </motion.div>
                                )}
                              </div>
                            )}

                            {/* Hints or success messages */}
                            {item.checked && !item.isCorrect && item.hint && ex.type !== "sentence_transformation" && (
                              <p className="text-xs text-amber-700 flex items-center gap-1 mt-1">
                                <HelpCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                <span>Indizio: {item.hint}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
