import { HistorySession } from "../types";
import { Clock, Calendar, MessageSquare, Trash2, ChevronRight, Award } from "lucide-react";

interface HistoryListProps {
  sessions: HistorySession[];
  onSelectSession: (session: HistorySession) => void;
  onDeleteSession: (sessionId: string) => void;
  activeSessionId?: string | null;
}

export default function HistoryList({
  sessions,
  onSelectSession,
  onDeleteSession,
  activeSessionId,
}: HistoryListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-3xl" id="history-empty-state">
        <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-700 text-sm">Nessuna registrazione salvata</h4>
        <p className="text-slate-400 text-xs mt-1">
          Le tue analisi verranno salvate qui per permetterti di tenere traccia dei progressi nel tempo.
        </p>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-3" id="history-list-root">
      <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold tracking-wider px-1">
        <span>Storico Esercitazioni ({sessions.length})</span>
      </div>

      <div className="space-y-2.5 max-h-[320px] md:max-h-[480px] overflow-y-auto pr-1" id="history-items-container">
        {sessions.map((session) => {
          const isActive = activeSessionId === session.id;

          return (
            <div
              key={session.id}
              id={`history-item-${session.id}`}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
                isActive
                  ? "bg-slate-900 text-white border-slate-950 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
              onClick={() => onSelectSession(session)}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="text-xs font-semibold">{formatDate(session.timestamp)}</span>
                </div>
                
                <h5 className="font-semibold text-sm truncate max-w-[200px]" title={session.audioName}>
                  {session.audioName}
                </h5>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {session.mode}
                  </span>
                  {session.targetLevel && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? "bg-emerald-500/30 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      Target: {session.targetLevel}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Result estimated CEFR level badge */}
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs border shrink-0 ${
                  isActive 
                    ? "bg-white/10 text-white border-white/20" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}>
                  {session.result.cefrLevelEstimated}
                </div>

                <button
                  id={`btn-delete-history-${session.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${
                    isActive 
                      ? "text-white/60 hover:text-white hover:bg-white/10" 
                      : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title="Elimina dallo storico"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-80 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
