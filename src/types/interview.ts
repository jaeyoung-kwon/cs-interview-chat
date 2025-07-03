
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: string;
  question: string;
  category: string;
  expectedAnswer: string;
  difficulty: Difficulty;
  keywords?: string[];
  createdAt: Date;
}

export interface InterviewSession {
  id: string;
  type: 'basic' | 'ai';
  category?: string;
  difficulty?: Difficulty;
  questions: Question[];
  userAnswers: { questionId: string; answer: string; answerTime: number }[];
  startedAt: Date;
  completedAt?: Date;
  totalTime?: number;
}

export interface ComparisonResult {
  question: Question;
  userAnswer: string;
  expectedAnswer: string;
  answerTime: number;
  aiExampleAnswer?: string;
  keywords?: string[];
}

export interface AIEvaluation {
  strengths: string[];
  weaknesses: string[];
  overallFeedback: string;
  score: number;
}

export interface TokenInfo {
  remaining: number;
  total: number;
  lastRefresh: Date;
}
