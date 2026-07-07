export type ErrorCategory = "grammatica" | "lessico" | "fonetica" | "sintassi";
export type ErrorSeverity = "lieve" | "medio" | "grave";
export type ExerciseType = "fill_in_the_blank" | "pronunciation_drill" | "sentence_transformation";

export interface MetricDetail {
  score: number; // 1 to 5
  feedback: string; // pedagogical advice
}

export interface Metrics {
  fluency: MetricDetail;
  grammar: MetricDetail;
  vocabulary: MetricDetail;
  pronunciation: MetricDetail;
}

export interface GrammarError {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  category: ErrorCategory;
  cefrLevel: string; // A1, A2, B1, etc.
  severity: ErrorSeverity;
  isSelfCorrected?: boolean; // Student state
}

export interface ExerciseItem {
  question: string;
  correctAnswer: string;
  hint?: string;
  userAnswer?: string; // Student state
  isCorrect?: boolean; // Student state
  checked?: boolean; // Student state
}

export interface Exercise {
  title: string;
  description: string;
  type: ExerciseType;
  instructions: string;
  items: ExerciseItem[];
}

export interface AnalysisResult {
  transcription: string;
  isDialogue: boolean;
  cefrLevelEstimated?: string; // A1, A2, B1, B2, C1, C2 (optional if not yet analyzed)
  metrics?: Metrics;
  errors?: GrammarError[];
  exercises?: Exercise[];
  overallFeedback?: string;
}

export interface HistorySession {
  id: string;
  timestamp: string; // ISO String
  audioName: string;
  mode: "monologo" | "dialogo";
  targetLevel: string; // A1, A2, B1, B2, C1, C2
  result: AnalysisResult;
}
