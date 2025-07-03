
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { InterviewSession, ComparisonResult, AIEvaluation } from '@/types/interview';

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
    const answerTime = session.userAnswers[index]?.answerTime || 0;
    
    return {
      question,
      userAnswer,
      expectedAnswer: question.expectedAnswer,
      answerTime,
      aiExampleAnswer: session.type === 'ai' ? `${question.question}에 대한 AI 예시 답변입니다. 이 답변에서는 핵심적인 개념들을 다루고 있으며, 실무에서의 적용 방법과 함께 구체적인 예시를 포함하고 있습니다.` : undefined,
      keywords: question.keywords || []
    };
  });

  // AI 전체 평가 (목업 데이터)
  const aiEvaluation: AIEvaluation = {
    strengths: [
      '기본 개념에 대한 이해도가 높습니다',
      '구체적인 예시를 들어 설명하는 능력이 우수합니다',
      '논리적인 사고 과정을 잘 보여줍니다'
    ],
    weaknesses: [
      '답변 시간이 다소 길어 간결성이 부족합니다',
      '심화 개념에 대한 추가 학습이 필요합니다'
    ],
    overallFeedback: '전반적으로 면접에 잘 준비되어 있으며, 기본기가 탄탄합니다. 몇 가지 심화 개념만 보완한다면 더욱 좋은 결과를 얻을 수 있을 것입니다.',
    score: 75
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 px-1 rounded">$1</mark>`);
    });
    
    return highlightedText;
  };

  const averageAnswerTime = Math.round(
    session.userAnswers.reduce((sum, answer) => sum + answer.answerTime, 0) / session.userAnswers.length
  );

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
            <h1 className="text-xl font-bold text-gray-900">면접 결과 분석</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 면접 요약 */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">면접 완료!</h2>
            {session.type === 'ai' && (
              <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">종합 점수: {aiEvaluation.score}점</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
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
                {session.totalTime ? formatTime(session.totalTime) : '0:00'}
              </div>
              <div className="text-sm text-gray-600">총 소요 시간</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(averageAnswerTime)}
              </div>
              <div className="text-sm text-gray-600">평균 답변 시간</div>
            </div>
          </div>
        </Card>

        {/* AI 전체 평가 (AI 면접인 경우만) */}
        {session.type === 'ai' && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              AI 종합 평가
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  강점
                </h4>
                <ul className="space-y-1">
                  {aiEvaluation.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  개선점
                </h4>
                <ul className="space-y-1">
                  {aiEvaluation.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-600 mt-1 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-medium text-gray-900 mb-2">종합 피드백</h4>
              <p className="text-sm text-gray-700">{aiEvaluation.overallFeedback}</p>
            </div>
          </Card>
        )}

        {/* 질문별 비교 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">질문별 답변 분석</h3>
          
          {comparisons.map((comparison, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {comparison.question.category}
                  </Badge>
                  <Badge className={getDifficultyColor(comparison.question.difficulty)}>
                    {getDifficultyLabel(comparison.question.difficulty)}
                  </Badge>
                  <div className="ml-auto flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(comparison.answerTime)}
                  </div>
                </div>
                <h4 className="font-medium text-gray-900">{comparison.question.question}</h4>
              </div>

              <Tabs defaultValue="user-answer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user-answer">내 답변</TabsTrigger>
                  <TabsTrigger value="expected-answer">
                    {session.type === 'ai' ? 'AI 예시 답변' : '예상 답변'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="user-answer" className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <h5 className="font-medium text-gray-900">내 답변</h5>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{comparison.userAnswer}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="expected-answer" className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h5 className="font-medium text-gray-900">
                      {session.type === 'ai' ? 'AI 예시 답변' : '예상 답변'}
                    </h5>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div 
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightKeywords(
                          session.type === 'ai' ? comparison.aiExampleAnswer || comparison.expectedAnswer : comparison.expectedAnswer,
                          comparison.keywords
                        ) 
                      }}
                    />
                    {session.type === 'ai' && comparison.keywords.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs text-green-700 mb-2">💡 꼭 포함해야 할 핵심 키워드:</p>
                        <div className="flex flex-wrap gap-1">
                          {comparison.keywords.map((keyword, idx) => (
                            <Badge key={idx} className="bg-yellow-100 text-yellow-800 text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
