
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { InterviewSession, ComparisonResult } from '@/types/interview';

const ComparisonResultPage = () => {
  const location = useLocation();
  const session = location.state?.session as InterviewSession;
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">면접 세션 데이터를 찾을 수 없습니다.</p>
          <Button asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const comparisons: ComparisonResult[] = session.questions.map((question, index) => {
    const userAnswer = session.userAnswers[index]?.answer || '';
    return {
      question,
      userAnswer,
      expectedAnswer: question.expectedAnswer,
      aiEvaluation: session.type === 'ai' ? 'AI 평가: 답변이 잘 구성되어 있습니다. 추가적인 구체적 예시가 있다면 더 좋겠습니다.' : undefined
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                홈으로
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">면접 결과 비교</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 면접 요약 */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">면접 완료!</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{session.questions.length}</div>
              <div className="text-sm text-gray-600">총 질문 수</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {session.type === 'basic' ? '기본' : 'AI'} 면접
              </div>
              <div className="text-sm text-gray-600">면접 타입</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((new Date(session.completedAt!).getTime() - new Date(session.startedAt).getTime()) / 60000)}분
              </div>
              <div className="text-sm text-gray-600">소요 시간</div>
            </div>
          </div>
        </Card>

        {/* 질문별 비교 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">질문별 답변 비교</h3>
          
          {comparisons.map((comparison, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {comparison.question.category}
                  </span>
                  <span className="text-sm text-gray-500">질문 {index + 1}</span>
                </div>
                <h4 className="font-medium text-gray-900">{comparison.question.question}</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 사용자 답변 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <h5 className="font-medium text-gray-900">내 답변</h5>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{comparison.userAnswer}</p>
                  </div>
                </div>

                {/* 예상 답변 또는 AI 평가 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h5 className="font-medium text-gray-900">
                      {session.type === 'ai' ? 'AI 평가' : '예상 답변'}
                    </h5>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {session.type === 'ai' && comparison.aiEvaluation 
                        ? comparison.aiEvaluation 
                        : comparison.expectedAnswer}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 justify-center mt-8">
          <Button asChild variant="outline">
            <Link to="/history">면접 히스토리 보기</Link>
          </Button>
          <Button asChild>
            <Link to="/">새 면접 시작하기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ComparisonResultPage;
