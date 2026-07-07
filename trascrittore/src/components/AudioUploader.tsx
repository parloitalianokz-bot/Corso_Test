import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AudioUploaderProps {
  onAudioReady: (base64Data: string, mimeType: string, fileName: string) => void;
}

export default function AudioUploader({ onAudioReady }: AudioUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = [
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/webm",
    "audio/x-m4a",
    "audio/m4a",
    "audio/mp4",
  ];

  const processFile = (file: File) => {
    setError(null);

    // Validate type
    const isAudio = file.type.startsWith("audio/") || allowedTypes.includes(file.type);
    if (!isAudio) {
      setError("Il file selezionato non è un file audio supportato. Carica un file MP3, WAV, M4A o OGG.");
      return;
    }

    // Validate size (max 25MB for reasonable server transit and API limits)
    if (file.size > 25 * 1024 * 1024) {
      setError("Il file è troppo grande (limite: 25MB). Carica un file più piccolo.");
      return;
    }

    setSelectedFile(file);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      onAudioReady(base64Data, file.type || "audio/mpeg", file.name);
    };
    reader.onerror = () => {
      setError("Si è verificato un errore durante la lettura del file.");
    };
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto" id="audio-uploader-container">
      {error && (
        <div className="p-4 mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2" id="uploader-error">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all ${
              dragActive
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-slate-50/80"
            }`}
            id="audio-dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleChange}
              id="audio-file-input"
            />
            <div className="p-3 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 mb-4">
              <Upload className="h-6 w-6 text-slate-600" />
            </div>
            <h4 className="font-medium text-slate-800 text-lg">Carica un file audio</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">
              Trascina qui il file oppure clicca per sfogliare la cartella.
            </p>
            <p className="text-slate-400 text-xs mt-3">
              Formati supportati: MP3, WAV, M4A, OGG, WEBM (Max 25MB)
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="file-details"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 border border-slate-200 bg-slate-50 rounded-2xl flex items-center justify-between shadow-sm"
            id="uploaded-file-details"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <FileAudio className="h-6 w-6" />
              </div>
              <div className="text-left overflow-hidden">
                <h5 className="font-medium text-slate-800 truncate max-w-[240px] md:max-w-xs">{selectedFile.name}</h5>
                <p className="text-slate-500 text-xs font-mono mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "audio/file"}
                </p>
              </div>
            </div>
            <button
              id="btn-clear-file"
              onClick={clearSelection}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
