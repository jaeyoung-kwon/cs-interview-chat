import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Send, Bot, Mic, MicOff, Timer, Coins } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Question, InterviewSession, Difficulty, TokenInfo } from '@/types/interview';
import { toast } from "@/hooks/use-toast";

const AIInterview = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('intermediate');
  const [userAnswer, setUserAnswer] = useState('');
  const [questionHistory, setQuestionHistory] = useState<{ question: string; answer: string; category: string; difficulty: Difficulty; answerTime: number }[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState<Date | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    remaining: 10,
    total: 10,
    lastRefresh: new Date()
  });
  const navigate = useNavigate();

  const categories = ['전체', 'JavaScript', 'CS', 'React', '데이터베이스', '네트워크', '운영체제'];

  const aiQuestions = {
    'JavaScript': {
      'beginner': [
        'JavaScript에서 var, let, const의 차이점은 무엇인가요?',
        'JavaScript의 데이터 타입에는 어떤 것들이 있나요?'
      ],
      'intermediate': [
        'JavaScript의 호이스팅(Hoisting)에 대해 설명해주세요.',
        '클로저(Closure)란 무엇이고 어떻게 활용할 수 있나요?'
      ],
      'advanced': [
        'JavaScript의 이벤트 루프(Event Loop)에 대해 자세히 설명해주세요.',
        'Prototype과 Prototype Chain에 대해 설명해주세요.'
      ]
    },
    'CS': {
      'beginner': [
        '프로그래밍에서 변수란 무엇인가요?',
        '컴파일러와 인터프리터의 차이점은 무엇인가요?'
      ],
      'intermediate': [
        'TCP와 UDP의 차이점은 무엇인가요?',
        '프로세스와 스레드의 차이점을 설명해주세요.'
      ],
      'advanced': [
        'OSI 7계층 모델에 대해 상세히 설명해주세요.',
        '데드락(Deadlock)이 발생하는 조건과 해결 방법을 설명해주세요.'
      ]
    }
  };

  const followUpQuestions = [
    '구체적인 예시를 들어 설명해주실 수 있나요?',
    '실무에서는 어떻게 활용되는지 말씀해주세요.',
    '다른 방법과 비교했을 때 어떤 장단점이 있을까요?',
    '성능 면에서는 어떤 차이가 있을까요?'
  ];

  useEffect(() => {
    const savedTokens = localStorage.getItem('ai-tokens');
    if (savedTokens) {
      setTokenInfo(JSON.parse(savedTokens));
    }
  }, []);

  const useToken = () => {
    if (tokenInfo.remaining > 0) {
      const newTokenInfo = {
        ...tokenInfo,
        remaining: tokenInfo.remaining - 1
      };
      setTokenInfo(newTokenInfo);
      localStorage.setItem('ai-tokens', JSON.stringify(newTokenInfo));
      return true;
    }
    return false;
  };

  const generateQuestion = () => {
    const currentCat = selectedCategory === '전체' ? 'CS' : selectedCategory;
    const currentDiff = selectedDifficulty || 'intermediate';
    
    let availableQuestions: string[] = [];
    
    if (aiQuestions[currentCat as keyof typeof aiQuestions]) {
      availableQuestions = aiQuestions[currentCat as keyof typeof aiQuestions][currentDiff as Difficulty] || [];
    }

    if (availableQuestions.length === 0) {
      availableQuestions = aiQuestions.CS.intermediate;
    }

    const askedQuestions = questionHistory.map(q => q.question);
    const newQuestions = availableQuestions.filter(q => !askedQuestions.includes(q));
    
    if (newQuestions.length > 0) {
      return newQuestions[Math.floor(Math.random() * newQuestions.length)];
    } else if (Math.random() > 0.3) {
      return followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
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

    if (tokenInfo.remaining === 0) {
      toast({
        title: "토큰이 부족합니다",
        description: "AI 면접을 진행하려면 토큰이 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (!useToken()) {
      return;
    }

    setSessionStarted(true);
    setSessionStartTime(new Date());
    setAnswerStartTime(new Date());
    const firstQuestion = generateQuestion();
    setCurrentQuestion(firstQuestion);
    setCurrentDifficulty(selectedDifficulty as Difficulty || 'intermediate');
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (!isListening) {
        setIsListening(true);
        toast({
          title: "음성 인식 시작",
          description: "말씀해주세요...",
        });
        
        setTimeout(() => {
          setIsListening(false);
          setUserAnswer(prev => prev + " 음성으로 입력된 내용입니다.");
          toast({
            title: "음성 인식 완료",
            description: "텍스트로 변환되었습니다.",
          });
        }, 3000);
      } else {
        setIsListening(false);
        toast({
          title: "음성 인식 중단",
          description: "음성 입력이 중단되었습니다.",
        });
      }
    } else {
      toast({
        title: "음성 인식 미지원",
        description: "이 브라우저는 음성 인식을 지원하지 않습니다.",
        variant: "destructive"
      });
    }
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

    const now = new Date();
    const answerTime = answerStartTime ? Math.floor((now.getTime() - answerStartTime.getTime()) / 1000) : 0;

    const newHistory = [...questionHistory, {
      question: currentQuestion,
      answer: userAnswer,
      category: selectedCategory,
      difficulty: currentDifficulty,
      answerTime
    }];
    setQuestionHistory(newHistory);
    setQuestionCount(questionCount + 1);

    if (questionCount >= 4 || currentQuestion.includes('마지막 질문')) {
      const totalTime = sessionStartTime ? Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000) : 0;
      
      const mockQuestions: Question[] = newHistory.map((item, index) => ({
        id: `ai-${index}`,
        question: item.question,
        category: item.category,
        difficulty: item.difficulty,
        expectedAnswer: 'AI가 생성한 예시 답변입니다.',
        keywords: ['핵심키워드1', '핵심키워드2'],
        createdAt: new Date()
      }));

      const session: InterviewSession = {
        id: Date.now().toString(),
        type: 'ai',
        category: selectedCategory,
        difficulty: selectedDifficulty as Difficulty,
        questions: mockQuestions,
        userAnswers: newHistory.map((item, index) => ({
          questionId: `ai-${index}`,
          answer: item.answer,
          answerTime: item.answerTime
        })),
        startedAt: sessionStartTime || new Date(),
        completedAt: now,
        totalTime
      };

      const savedSessions = localStorage.getItem('interview-sessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(session);
      localStorage.setItem('interview-sessions', JSON.stringify(sessions));

      navigate('/comparison', { state: { session } });
      return;
    }

    const nextQuestion = generateQuestion();
    setCurrentQuestion(nextQuestion);
    setUserAnswer('');
    setAnswerStartTime(new Date());
  };

  const difficulties: { value: Difficulty | ''; label: string }[] = [
    { value: '', label: '전체' },
    { value: 'beginner', label: '초급' },
    { value: 'intermediate', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '';
    }
  };

  if (!sessionStarted) {
    const tokenPercentage = (tokenInfo.remaining / tokenInfo.total) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
              
              {/* 토큰 정보 */}
              <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <div className="flex-1 min-w-24">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">토큰</span>
                      <span className="text-xs text-gray-600">{tokenInfo.remaining}/{tokenInfo.total}</span>
                    </div>
                    <Progress value={tokenPercentage} className="h-1" />
                  </div>
                </div>
              </Card>
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

              <div>
                <label className="block text-sm font-medium mb-2">난이도 선택</label>
                <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty | '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="난이도를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-sm text-gray-600 p-3 bg-blue-50 rounded">
                <p>면접 1회당 <strong>1토큰</strong>이 소모됩니다</p>
                <p>남은 토큰: <strong>{tokenInfo.remaining}개</strong></p>
              </div>

              <Button
                onClick={startInterview}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center gap-2"
                disabled={tokenInfo.remaining === 0}
              >
                <Bot className="w-5 h-5" />
                AI 면접 시작하기
              </Button>
              
              {tokenInfo.remaining === 0 && (
                <p className="text-xs text-red-600 text-center">토큰을 충전해주세요</p>
              )}
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const elapsedSeconds = answerStartTime ? Math.floor((Date.now() - answerStartTime.getTime()) / 1000) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">AI 면접 진행중</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {formatTime(elapsedSeconds)}
              </div>
              <div>
                질문 {questionCount + 1}개 | {selectedCategory}
              </div>
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
              <Badge className={getDifficultyColor(currentDifficulty)}>
                {getDifficultyLabel(currentDifficulty)}
              </Badge>
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
            <div className="relative">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="답변을 입력하세요..."
                rows={8}
                className="w-full pr-12"
              />
              <Button
                type="button"
                size="sm"
                variant={isListening ? "destructive" : "ghost"}
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={toggleVoiceInput}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
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
