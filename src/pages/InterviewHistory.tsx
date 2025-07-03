
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, FileText, Bot, User, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InterviewSession } from '@/types/interview';

const InterviewHistory = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const savedSessions = localStorage.getItem('interview-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      parsedSessions.sort((a: InterviewSession, b: InterviewSession) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
      setSessions(parsedSessions);
      setFilteredSessions(parsedSessions);
    }
  }, []);

  useEffect(() => {
    let filtered = sessions;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(session => session.category === categoryFilter);
    }
    
    setFilteredSessions(filtered);
  }, [sessions, typeFilter, categoryFilter]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDuration = (start: Date | string, end?: Date | string, totalTime?: number) => {
    if (totalTime) return formatTime(totalTime);
    if (!end) return '진행중';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const seconds = Math.floor((endTime - startTime) / 1000);
    return formatTime(seconds);
  };

  const getUniqueCategories = () => {
    const categories = sessions
      .map(session => session.category)
      .filter(category => category)
      .filter((category, index, arr) => arr.indexOf(category) === index);
    return ['all', ...categories];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '';
    }
  };

  const getQuestionSummary = (session: InterviewSession) => {
    const categories = Array.from(new Set(session.questions.map(q => q.category)));
    const difficulties = Array.from(new Set(session.questions.map(q => q.difficulty)));
    
    return {
      categories: categories.slice(0, 3), // 최대 3개까지만 표시
      difficulties: difficulties,
      totalQuestions: session.questions.length
    };
  };

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
            <h1 className="text-xl font-bold text-gray-900">면접 히스토리</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mb-4">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 면접 기록이 없습니다</h3>
              <p className="text-gray-600">첫 번째 면접을 시작해보세요!</p>
            </div>
            <Button asChild>
              <Link to="/">면접 시작하기</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* 필터 */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-gray-600" />
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">타입:</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="basic">기본 면접</SelectItem>
                        <SelectItem value="ai">AI 면접</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">카테고리:</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {getUniqueCategories().slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {filteredSessions.length}개 결과
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">총 {sessions.length}개의 면접 기록</h2>
              <p className="text-gray-600">지금까지 진행한 면접들을 확인하고 복습해보세요.</p>
            </div>

            {filteredSessions.map((session) => {
              const questionSummary = getQuestionSummary(session);
              
              return (
                <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {session.type === 'ai' ? (
                          <Bot className="w-5 h-5 text-green-600" />
                        ) : (
                          <User className="w-5 h-5 text-blue-600" />
                        )}
                        <h3 className="font-semibold text-lg">
                          {session.type === 'ai' ? 'AI 면접' : '기본 면접'}
                        </h3>
                        <Badge className={session.completedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {session.completedAt ? '완료' : '진행중'}
                        </Badge>
                        {session.category && (
                          <Badge variant="outline">{session.category}</Badge>
                        )}
                        {session.difficulty && (
                          <Badge className={getDifficultyColor(session.difficulty)}>
                            {getDifficultyLabel(session.difficulty)}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.startedAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {calculateDuration(session.startedAt, session.completedAt, session.totalTime)}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {session.questions.length}개 질문
                        </div>
                      </div>

                      {/* 질문 카테고리 및 난이도 요약 */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs text-gray-500 font-medium">질문 유형:</span>
                          {questionSummary.categories.map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {questionSummary.categories.length < Array.from(new Set(session.questions.map(q => q.category))).length && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              +{Array.from(new Set(session.questions.map(q => q.category))).length - questionSummary.categories.length}개 더
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500 font-medium">난이도:</span>
                          {questionSummary.difficulties.map(difficulty => (
                            <Badge key={difficulty} className={`${getDifficultyColor(difficulty)} text-xs`}>
                              {getDifficultyLabel(difficulty)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 첫 번째 질문 미리보기 */}
                      <div className="text-sm text-gray-700">
                        <strong>첫 번째 질문:</strong> {session.questions[0]?.question}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {session.completedAt && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.location.href = `/comparison?sessionId=${session.id}`;
                          }}
                        >
                          결과 보기
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewHistory;
