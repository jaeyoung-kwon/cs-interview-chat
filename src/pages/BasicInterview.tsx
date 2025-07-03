
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, MicOff, Timer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Question, InterviewSession, Difficulty } from '@/types/interview';
import { toast } from "@/hooks/use-toast";

const BasicInterview = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; answerTime: number }[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState<Date | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuestions = localStorage.getItem('interview-questions');
    if (savedQuestions) {
      const allQuestions = JSON.parse(savedQuestions);
      setQuestions(allQuestions);
    }
  }, []);

  useEffect(() => {
    let filtered = questions;
    
    if (selectedCategory && selectedCategory !== '전체') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // 질문을 랜덤하게 섞기
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setFilteredQuestions(shuffled);
  }, [questions, selectedCategory, selectedDifficulty]);

  const startInterview = () => {
    if (filteredQuestions.length === 0) {
      toast({
        title: "질문이 없습니다",
        description: "선택한 조건에 맞는 질문이 없습니다. 다른 조건을 선택하거나 질문을 등록해주세요.",
        variant: "destructive"
      });
      return;
    }
    setSessionStarted(true);
    setSessionStartTime(new Date());
    setAnswerStartTime(new Date());
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (!isListening) {
        setIsListening(true);
        toast({
          title: "음성 인식 시작",
          description: "말씀해주세요...",
        });
        
        // 실제 구현에서는 Web Speech API 사용
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

    const newAnswers = [...answers, {
      questionId: filteredQuestions[currentQuestionIndex].id,
      answer: userAnswer,
      answerTime
    }];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < filteredQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setAnswerStartTime(new Date());
    } else {
      // 면접 완료
      const totalTime = sessionStartTime ? Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000) : 0;
      
      const session: InterviewSession = {
        id: Date.now().toString(),
        type: 'basic',
        category: selectedCategory,
        difficulty: selectedDifficulty as Difficulty,
        questions: filteredQuestions,
        userAnswers: newAnswers,
        startedAt: sessionStartTime || new Date(),
        completedAt: now,
        totalTime
      };

      // 세션 저장
      const savedSessions = localStorage.getItem('interview-sessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(session);
      localStorage.setItem('interview-sessions', JSON.stringify(sessions));

      navigate('/comparison', { state: { session } });
    }
  };

  const categories = Array.from(new Set(['전체', ...questions.map(q => q.category)]));
  const difficulties: { value: Difficulty | ''; label: string }[] = [
    { value: '', label: '전체' },
    { value: 'beginner', label: '초급' },
    { value: 'intermediate', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  const currentQuestion = filteredQuestions[currentQuestionIndex];
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <h1 className="text-xl font-bold text-gray-900">기본 면접</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">기본 면접 준비</h2>
            <p className="text-lg text-gray-600 mb-8">
              등록하신 질문들을 바탕으로 면접을 진행합니다.<br/>
              카테고리와 난이도를 선택하여 맞춤형 면접을 진행하세요.
            </p>
          </div>

          <Card className="p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">카테고리 선택</label>
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

              <div className="text-center text-sm text-gray-600">
                선택된 조건에 맞는 질문: <strong>{filteredQuestions.length}개</strong>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">조건에 맞는 질문이 없습니다.</p>
                  <Button asChild>
                    <Link to="/questions">질문 등록하러 가기</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={startInterview}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  면접 시작하기
                </Button>
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
              <h1 className="text-xl font-bold text-gray-900">기본 면접 진행중</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {formatTime(elapsedSeconds)}
              </div>
              <div>
                {currentQuestionIndex + 1} / {filteredQuestions.length} 질문
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          {/* 질문 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800">
                {currentQuestion.category}
              </Badge>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {getDifficultyLabel(currentQuestion.difficulty)}
              </Badge>
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
              className="flex items-center gap-2"
              size="lg"
            >
              <Send className="w-4 h-4" />
              {currentQuestionIndex + 1 === filteredQuestions.length ? '면접 완료' : '다음 질문'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default BasicInterview;
