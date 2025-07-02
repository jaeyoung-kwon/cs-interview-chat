
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ChatInterface from '@/components/ChatInterface';
import { Brain, MessageSquare, History, Mic, Settings, Bot, User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isChatStarted, setIsChatStarted] = useState(false);

  const startInterview = () => {
    setIsChatStarted(true);
  };

  if (isChatStarted) {
    return <ChatInterface onGoBack={() => setIsChatStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CS 면접 시뮬레이션</h1>
                <p className="text-sm text-gray-600">혼자서도 완벽한 면접 준비</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  히스토리
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/questions" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  질문 관리
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            실전 같은 CS 면접 연습
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            기본 면접과 AI 면접 두 가지 방식으로 체계적이고 효율적인 CS 면접 준비를 경험해보세요.
          </p>
        </div>

        {/* 면접 시작 옵션 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 기본 면접 */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">기본 면접</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              사용자가 직접 등록한 질문과 답변을 바탕으로 면접을 진행합니다.<br/>
              등록된 질문을 랜덤으로 출제하여 연습할 수 있습니다.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>✓ 질문과 답변을 직접 등록</p>
              <p>✓ 카테고리별 질문 관리</p>
              <p>✓ 등록된 답변과 비교 분석</p>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link to="/basic-interview">기본 면접 시작하기</Link>
            </Button>
          </Card>

          {/* AI 면접 */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI 면접</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              AI가 실시간으로 질문을 생성하고 꼬리 질문을 통해<br/>
              실제 면접처럼 경험할 수 있습니다.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>✓ AI가 자체적으로 질문 생성</p>
              <p>✓ 실시간 꼬리 질문 제공</p>
              <p>✓ AI 평가 및 피드백</p>
            </div>
            <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/ai-interview">AI 면접 시작하기</Link>
            </Button>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">즉각적 시작</h3>
            <p className="text-sm text-gray-600">버튼 클릭 한 번으로 바로 면접 시작</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Mic className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">음성 입력</h3>
            <p className="text-sm text-gray-600">텍스트와 음성 모두 지원</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">꼬리 질문</h3>
            <p className="text-sm text-gray-600">실제 면접처럼 연속된 질문</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <History className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">답변 기록</h3>
            <p className="text-sm text-gray-600">연습 내용 저장 및 복습</p>
          </Card>
        </div>

        {/* Legacy CS 면접 (기존 기능 유지) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            기존 CS 면접 (목업 데이터)
          </h3>
          <p className="text-gray-600 mb-8">
            운영체제, 네트워크, 데이터베이스, 자료구조 등 다양한 CS 질문이 준비되어 있습니다.
          </p>
          
          <Button 
            onClick={startInterview}
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg font-semibold rounded-xl"
          >
            기존 CS 면접 시작하기
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            💡 API 키 없이도 목업 데이터로 즉시 체험 가능
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
