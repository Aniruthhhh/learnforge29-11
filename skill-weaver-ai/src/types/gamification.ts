export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss';

export interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  category?: 'Conceptual' | 'Application' | 'Analytical' | 'Tricky' | 'Exam-Level';
  answerPoints?: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: Difficulty;
}

export interface Concept {
  title: string;
  definition: string;
  relationship: string;
}

export interface StudyMaterial {
  summary: string;
  questions: Question[];
  flashcards: Flashcard[];
  concepts: Concept[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  isUnlocked: boolean;
  isCompleted: boolean;
  score: number;
  questions: Question[];
}

export interface GameSession {
  levels: Level[];
  currentLevelId: string | null;
  status: 'idle' | 'playing' | 'completed';
}

export interface UserProfile {
  xp: number;
  rank: string;
  streak: number;
  weakAreas: string[];
  totalAccuracy: number;
  questionsAttempted: number;
  questionsCorrect: number;
}

export type UploadState = 'idle' | 'processing' | 'success' | 'error';
