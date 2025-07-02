
export interface Question {
  id: string;
  question: string;
  category: string;
  expectedAnswer: string;
  createdAt: Date;
}

export interface InterviewSession {
  id: string;
  type: 'basic' | 'ai';
  questions: Question[];
  userAnswers: { questionId: string; answer: string }[];
  startedAt: Date;
  completedAt?: Date;
}

export interface ComparisonResult {
  question: Question;
  userAnswer: string;
  expectedAnswer: string;
  aiEvaluation?: string;
}
