
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, FileText, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InterviewSession } from '@/types/interview';

const InterviewHistory = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    const savedSessions = localStorage.getItem('interview-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      // 최신순으로 정렬
      parsedSessions.sort((a: InterviewSession, b: InterviewSession) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
      setSessions(parsedSessions);
    }
  }, []);

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

  const calculateDuration = (start: Date | string, end?: Date | string) => {
    if (!end) return '진행중';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const minutes = Math.floor((endTime - startTime) / 60000);
    return `${minutes}분`;
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
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">총 {sessions.length}개의 면접 기록</h2>
              <p className="text-gray-600">지금까지 진행한 면접들을 확인하고 복습해보세요.</p>
            </div>

            {sessions.map((session) => (
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
                      <span className={`px-2 py-1 text-xs rounded ${
                        session.completedAt 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.completedAt ? '완료' : '진행중'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.startedAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {calculateDuration(session.startedAt, session.completedAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {session.questions.length}개 질문
                      </div>
                    </div>

                    {/* 카테고리 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.from(new Set(session.questions.map(q => q.category))).map(category => (
                        <span key={category} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* 질문 미리보기 */}
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
                          // 결과 보기 (ComparisonResult로 이동)
                          window.location.href = `/comparison?sessionId=${session.id}`;
                        }}
                      >
                        결과 보기
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewHistory;
