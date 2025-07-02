
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Question, InterviewSession } from '@/types/interview';
import { toast } from "@/hooks/use-toast";

const AIInterview = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questionHistory, setQuestionHistory] = useState<{ question: string; answer: string; category: string }[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();

  const categories = ['전체', 'JavaScript', 'CS', 'React', '데이터베이스', '네트워크', '운영체제'];

  // AI 질문 목업 데이터
  const aiQuestions = {
    'JavaScript': [
      'JavaScript의 호이스팅(Hoisting)에 대해 설명해주세요.',
      'let, const, var의 차이점은 무엇인가요?',
      '클로저(Closure)란 무엇이고 어떻게 활용할 수 있나요?',
      'Promise와 async/await의 차이점을 설명해주세요.'
    ],
    'CS': [
      'TCP와 UDP의 차이점은 무엇인가요?',
      '프로세스와 스레드의 차이점을 설명해주세요.',
      'HTTP와 HTTPS의 차이점은 무엇인가요?',
      '데이터베이스의 ACID 속성에 대해 설명해주세요.'
    ],
    'React': [
      'React의 Virtual DOM이 무엇이고 왜 사용하나요?',
      'useState와 useEffect의 사용법을 설명해주세요.',
      'React의 생명주기(Lifecycle)에 대해 설명해주세요.',
      'Props와 State의 차이점은 무엇인가요?'
    ]
  };

  const followUpQuestions = [
    '구체적인 예시를 들어 설명해주실 수 있나요?',
    '실무에서는 어떻게 활용되는지 말씀해주세요.',
    '다른 방법과 비교했을 때 어떤 장단점이 있을까요?',
    '성능 면에서는 어떤 차이가 있을까요?',
    '실제 프로젝트에서 경험해보신 적이 있나요?'
  ];

  const generateQuestion = () => {
    let availableQuestions: string[] = [];
    
    if (selectedCategory === '전체') {
      availableQuestions = Object.values(aiQuestions).flat();
    } else {
      availableQuestions = aiQuestions[selectedCategory as keyof typeof aiQuestions] || [];
    }

    if (availableQuestions.length === 0) {
      availableQuestions = aiQuestions.CS; // 기본값
    }

    // 이미 물어본 질문 제외
    const askedQuestions = questionHistory.map(q => q.question);
    const newQuestions = availableQuestions.filter(q => !askedQuestions.includes(q));
    
    if (newQuestions.length > 0) {
      const randomQuestion = newQuestions[Math.floor(Math.random() * newQuestions.length)];
      return randomQuestion;
    } else if (Math.random() > 0.3) {
      // 꼬리 질문 생성
      const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
      return followUp;
    } else {
      return '마지막 질문입니다. 전반적인 면접 경험은 어떠셨나요?';
    }
  };

  const startInterview = () => {
    if (!selectedCategory) {
      toast({
        title: "카테고리를 선택해주세요",
        description: "면접을 진행할 카테고리를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setSessionStarted(true);
    const firstQuestion = generateQuestion();
    setCurrentQuestion(firstQuestion);
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

    // 답변 기록
    const newHistory = [...questionHistory, {
      question: currentQuestion,
      answer: userAnswer,
      category: selectedCategory
    }];
    setQuestionHistory(newHistory);
    setQuestionCount(questionCount + 1);

    // 면접 종료 조건 (5개 이상 질문했거나, 마지막 질문이었을 경우)
    if (questionCount >= 4 || currentQuestion.includes('마지막 질문')) {
      // AI 면접 완료 - 비교 페이지로 이동
      const mockQuestions: Question[] = newHistory.map((item, index) => ({
        id: `ai-${index}`,
        question: item.question,
        category: item.category,
        expectedAnswer: 'AI가 생성한 답변입니다.', // 실제로는 AI가 평가
        createdAt: new Date()
      }));

      const session: InterviewSession = {
        id: Date.now().toString(),
        type: 'ai',
        questions: mockQuestions,
        userAnswers: newHistory.map((item, index) => ({
          questionId: `ai-${index}`,
          answer: item.answer
        })),
        startedAt: new Date(),
        completedAt: new Date()
      };

      // 세션 저장
      const savedSessions = localStorage.getItem('interview-sessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(session);
      localStorage.setItem('interview-sessions', JSON.stringify(sessions));

      navigate('/comparison', { state: { session } });
      return;
    }

    // 다음 질문 생성
    const nextQuestion = generateQuestion();
    setCurrentQuestion(nextQuestion);
    setUserAnswer('');
  };

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
              <h1 className="text-xl font-bold text-gray-900">AI 면접</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI와 함께하는 면접</h2>
            <p className="text-lg text-gray-600 mb-8">
              AI가 실시간으로 질문을 생성하고 꼬리 질문을 통해<br/>
              실제 면접처럼 경험할 수 있습니다.
            </p>
          </div>

          <Card className="p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">면접 카테고리 선택</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={startInterview}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center gap-2"
              >
                <Bot className="w-5 h-5" />
                AI 면접 시작하기
              </Button>
            </div>
          </Card>
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
              <Bot className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">AI 면접 진행중</h1>
            </div>
            <div className="text-sm text-gray-600">
              질문 {questionCount + 1}개 | {selectedCategory}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          {/* AI 질문 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">AI 면접관</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion}
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Send className="w-4 h-4" />
              답변 제출
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AIInterview;
