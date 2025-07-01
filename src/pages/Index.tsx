
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ChatInterface from '@/components/ChatInterface';
import { Brain, MessageSquare, History, Mic } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CS 면접 시뮬레이션</h1>
              <p className="text-sm text-gray-600">혼자서도 완벽한 면접 준비</p>
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
            3초 만에 시작하는 면접 시뮬레이션으로 체계적이고 효율적인 CS 면접 준비를 경험해보세요.
          </p>
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

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            지금 바로 CS 면접을 시작해보세요
          </h3>
          <p className="text-gray-600 mb-8">
            운영체제, 네트워크, 데이터베이스, 자료구조 등 다양한 CS 질문이 준비되어 있습니다.
          </p>
          
          <Button 
            onClick={startInterview}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            CS 면접 시작하기
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
