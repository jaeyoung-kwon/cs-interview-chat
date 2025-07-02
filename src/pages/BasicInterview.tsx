
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Question, InterviewSession } from '@/types/interview';
import { toast } from "@/hooks/use-toast";

const BasicInterview = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuestions = localStorage.getItem('interview-questions');
    if (savedQuestions) {
      const allQuestions = JSON.parse(savedQuestions);
      // 질문을 랜덤하게 섞기
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  }, []);

  const startInterview = () => {
    if (questions.length === 0) {
      toast({
        title: "질문이 없습니다",
        description: "먼저 질문을 등록해주세요.",
        variant: "destructive"
      });
      return;
    }
    setSessionStarted(true);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "답변을 입력해주세요",
        description: "답변을 작성한 후 제출해주세요.",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...answers, {
      questionId: questions[currentQuestionIndex].id,
      answer: userAnswer
    }];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
    } else {
      // 면접 완료 - 비교 페이지로 이동
      const session: InterviewSession = {
        id: Date.now().toString(),
        type: 'basic',
        questions: questions,
        userAnswers: newAnswers,
        startedAt: new Date(),
        completedAt: new Date()
      };

      // 세션 저장
      const savedSessions = localStorage.getItem('interview-sessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(session);
      localStorage.setItem('interview-sessions', JSON.stringify(sessions));

      // 비교 페이지로 이동
      navigate('/comparison', { state: { session } });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  돌아가기
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">기본 면접</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">기본 면접 준비</h2>
            <p className="text-lg text-gray-600 mb-8">
              등록하신 질문들을 바탕으로 면접을 진행합니다.<br/>
              총 {questions.length}개의 질문이 준비되어 있습니다.
            </p>

            {questions.length === 0 ? (
              <Card className="p-8 max-w-md mx-auto">
                <p className="text-gray-600 mb-4">등록된 질문이 없습니다.</p>
                <Button asChild>
                  <Link to="/questions">질문 등록하러 가기</Link>
                </Button>
              </Card>
            ) : (
              <Button
                onClick={startInterview}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                면접 시작하기
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">기본 면접 진행중</h1>
            </div>
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {questions.length} 질문
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          {/* 질문 */}
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded mb-4">
              {currentQuestion.category}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 답변 입력 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              답변을 입력하세요
            </label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="답변을 입력하세요..."
              rows={8}
              className="w-full"
            />
            <Button
              onClick={submitAnswer}
              className="flex items-center gap-2"
              size="lg"
            >
              <Send className="w-4 h-4" />
              {currentQuestionIndex + 1 === questions.length ? '면접 완료' : '다음 질문'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default BasicInterview;
