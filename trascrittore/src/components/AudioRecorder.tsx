import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, RefreshCw, Volume2, Video, HelpCircle, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AudioRecorderProps {
  onAudioReady: (base64Data: string, mimeType: string, fileName: string) => void;
}

export default function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [recordSystemAudio, setRecordSystemAudio] = useState(false);
  const [systemAudioWarning, setSystemAudioWarning] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // References for multi-stream stop
  const micStreamRef = useRef<MediaStream | null>(null);
  const systemStreamRef = useRef<MediaStream | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Clean up visualizer and audio urls
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      setMicPermissionError(null);
      setSystemAudioWarning(null);
      setAudioUrl(null);
      audioChunksRef.current = [];
      setRecordingTime(0);

      // 1. Get Microphone stream
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;

      let combinedStream = micStream;
      let systemStream: MediaStream | null = null;

      // 2. If configured, also request system / screen audio stream (WebRTC getDisplayMedia)
      if (recordSystemAudio) {
        try {
          systemStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: { ideal: 1 },
              height: { ideal: 1 },
              frameRate: { ideal: 1 }
            },
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
          });
          systemStreamRef.current = systemStream;

          const systemAudioTracks = systemStream.getAudioTracks();
          if (systemAudioTracks.length === 0) {
            setSystemAudioWarning(
              "Nessuna traccia audio di sistema selezionata. Ricorda di spuntare la casella 'Condividi anche l'audio' nel popup del browser. La registrazione conterrà solo la tua voce dal microfono."
            );
          }
        } catch (displayErr: any) {
          console.warn("L'utente ha annullato la condivisione dello schermo/audio o il browser non la supporta:", displayErr);
          setSystemAudioWarning(
            "Condivisione schermo/sistema annullata. Procediamo con la registrazione del solo microfono."
          );
        }
      }

      // 3. Mix streams if system audio is present
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;

        const dest = audioContext.createMediaStreamDestination();

        // Connect mic
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(dest);

        // Setup live audio level visualizer from mic
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        micSource.connect(analyser);
        analyserRef.current = analyser;

        // Connect system audio if active
        if (systemStream && systemStream.getAudioTracks().length > 0) {
          const systemSource = audioContext.createMediaStreamSource(systemStream);
          systemSource.connect(dest);
        }

        combinedStream = dest.stream;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVisualizer = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setAudioLevel(average / 128);
          animationFrameRef.current = requestAnimationFrame(updateVisualizer);
        };

        updateVisualizer();
      } catch (err) {
        console.warn("AudioContext mixing non riuscito, userò il flusso microfonico diretto.", err);
        combinedStream = micStream;
      }

      // Determine correct mime type
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mimeType = "audio/ogg";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      }

      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(combinedStream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(",")[1];
          onAudioReady(
            base64Data, 
            mimeType, 
            `Registrazione_${recordSystemAudio ? "Videoconferenza_" : ""}${new Date().toISOString().slice(0, 10)}.webm`
          );
        };

        // Stop all tracks safely
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((track) => track.stop());
          micStreamRef.current = null;
        }
        if (systemStreamRef.current) {
          systemStreamRef.current.getTracks().forEach((track) => track.stop());
          systemStreamRef.current = null;
        }

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
          analyserRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err: any) {
      console.error("Errore avvio registrazione:", err);
      setMicPermissionError(
        "Impossibile avviare la registrazione. Verifica che il browser abbia accesso al microfono e che i dispositivi audio funzionino correttamente."
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const resetRecorder = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
    setSystemAudioWarning(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-lg mx-auto" id="audio-recorder-container">
      {micPermissionError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl text-center w-full" id="mic-error">
          <p className="font-semibold">Errore Microfono/Registrazione:</p>
          <p className="mt-1">{micPermissionError}</p>
        </div>
      )}

      {systemAudioWarning && (
        <div className="p-4 mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl text-left w-full flex items-start gap-2" id="system-warning">
          <HelpCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{systemAudioWarning}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isRecording && !audioUrl ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center space-y-4 w-full"
          >
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors cursor-pointer" onClick={startRecording} id="btn-start-record-icon">
              <Mic className="h-8 w-8" />
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-slate-800 text-lg">Registra il tuo parlato</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                Registra la tua lezione o una conversazione di gruppo.
              </p>
            </div>

            {/* System Audio Toggle Box */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-left w-full space-y-3 shadow-sm" id="system-audio-toggle-box">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordSystemAudio}
                  onChange={(e) => setRecordSystemAudio(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  id="checkbox-system-audio"
                />
                <div className="text-sm">
                  <span className="font-bold text-slate-800 block">Registra anche la Videoconferenza</span>
                  <span className="text-slate-500 text-xs">Cattura l'audio degli altri studenti e docenti.</span>
                </div>
              </label>

              {recordSystemAudio && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs space-y-1.5 flex items-start gap-2">
                  <Monitor className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Istruzioni importanti:</p>
                    <ul className="list-disc pl-4 space-y-1 mt-0.5">
                      <li>Dopo aver cliccato "Avvia", il browser ti chiederà quale schermo o scheda condividere.</li>
                      <li>Scegli la <strong>Scheda del browser</strong> dove partecipi alla lezione (es. Zoom, Teams, Meet).</li>
                      <li><strong>Spunta la casella "Condividi audio della scheda"</strong> (in basso a sinistra) prima di confermare!</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <button
              id="btn-start-record"
              onClick={startRecording}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/10 transition-all flex items-center justify-center space-x-2"
            >
              <Mic className="h-4 w-4" />
              <span>Avvia Registrazione</span>
            </button>
          </motion.div>
        ) : isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center space-y-5 w-full text-center"
          >
            {/* Visualizer Ring / Pulse */}
            <div className="relative flex items-center justify-center h-28 w-28">
              <div
                className="absolute inset-0 bg-emerald-500/20 rounded-full animate-recording"
                style={{
                  transform: `scale(${1 + audioLevel * 0.5})`,
                  opacity: isPaused ? 0.2 : 0.6,
                }}
              />
              <div className="relative z-10 flex items-center justify-center h-16 w-16 bg-emerald-600 text-white rounded-full">
                <Mic className="h-7 w-7" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-3xl font-semibold text-slate-800">{formatTime(recordingTime)}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center justify-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" />
                {isPaused ? "In Pausa" : "Registrazione in corso"}
              </p>
              {recordSystemAudio && (
                <span className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                  <Monitor className="h-3 w-3" />
                  <span>Microfono + Videoconferenza</span>
                </span>
              )}
            </div>

            {/* Mic Sensitivity Meter */}
            {!isPaused && (
              <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden flex" id="mic-level-meter">
                <div
                  className="bg-emerald-500 h-full transition-all duration-75"
                  style={{ width: `${Math.min(100, audioLevel * 100)}%` }}
                />
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                id="btn-pause-record"
                onClick={pauseRecording}
                className="px-5 py-2 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 font-medium rounded-xl transition-colors flex items-center space-x-1.5"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span>{isPaused ? "Riprendi" : "Pausa"}</span>
              </button>

              <button
                id="btn-stop-record"
                onClick={stopRecording}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Square className="h-4 w-4 fill-white" />
                <span>Termina</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center space-y-4 w-full"
          >
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center space-x-2 text-emerald-700 w-full">
              <Volume2 className="h-5 w-5" />
              <span className="text-sm font-medium">Registrazione completata ({formatTime(recordingTime)})</span>
            </div>

            {/* Native browser player to review the recording */}
            {audioUrl && (
              <audio id="audio-preview-player" src={audioUrl} controls className="w-full mt-2" />
            )}

            <div className="flex items-center justify-center space-x-3 w-full mt-2">
              <button
                id="btn-retry-record"
                onClick={resetRecorder}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Riprova</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
