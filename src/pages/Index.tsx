
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Bot, History, Settings, Coins, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TokenInfo } from '@/types/interview';

const Index = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    remaining: 10,
    total: 10,
    lastRefresh: new Date()
  });

  useEffect(() => {
    const savedTokens = localStorage.getItem('ai-tokens');
    if (savedTokens) {
      const tokens = JSON.parse(savedTokens);
      setTokenInfo(tokens);
    } else {
      // 초기 토큰 설정
      const initialTokens = {
        remaining: 10,
        total: 10,
        lastRefresh: new Date()
      };
      localStorage.setItem('ai-tokens', JSON.stringify(initialTokens));
      setTokenInfo(initialTokens);
    }
  }, []);

  const purchaseTokens = () => {
    // 토큰 구매 로직 (실제로는 결제 시스템 연동 필요)
    const newTokenInfo = {
      ...tokenInfo,
      remaining: tokenInfo.remaining + 20,
      total: tokenInfo.total + 20
    };
    setTokenInfo(newTokenInfo);
    localStorage.setItem('ai-tokens', JSON.stringify(newTokenInfo));
  };

  const tokenPercentage = (tokenInfo.remaining / tokenInfo.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Re:Answer</h1>
              <p className="text-gray-600 mt-1">개발자 면접 시뮬레이션 플랫폼</p>
            </div>
            
            {/* 토큰 정보 */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">AI 토큰</span>
                    <span className="text-sm text-gray-600">{tokenInfo.remaining}/{tokenInfo.total}</span>
                  </div>
                  <Progress value={tokenPercentage} className="h-2" />
                </div>
                {tokenInfo.remaining < 5 && (
                  <Button 
                    size="sm" 
                    onClick={purchaseTokens}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    충전
                  </Button>
                )}
              </div>
              {tokenInfo.remaining < 3 && (
                <p className="text-xs text-orange-600 mt-1">토큰이 부족합니다. 충전을 고려해보세요!</p>
              )}
            </Card>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            실전 같은 면접 연습으로<br/>
            <span className="text-blue-600">취업 성공</span>하세요
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            혼자서도 충분히 연습할 수 있는 면접 시뮬레이션으로<br/>
            자신감 있게 면접에 임하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 기본 면접 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">기본 면접</h3>
                <p className="text-sm text-gray-600">맞춤형 질문으로 연습</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>직접 등록한 질문과 답변을 바탕으로 면접을 진행합니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>등록된 질문을 바탕으로 랜덤 질문을 제공합니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>카테고리별, 난이도별 질문 관리가 가능합니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>텍스트 및 음성 입력을 지원합니다</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/questions" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  질문 관리하기
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/basic-interview" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  기본 면접 시작하기
                </Link>
              </Button>
            </div>
          </Card>

          {/* AI 면접 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 bg-gradient-to-br from-white to-green-50 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">AI 면접</h3>
                <p className="text-sm text-gray-600">실전 같은 AI 면접관</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>AI가 실시간으로 질문을 생성하고 꼬리 질문을 던집니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>실제 면접처럼 자연스러운 대화형 면접을 경험할 수 있습니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>AI 예시 답안과 전체적인 면접 평가를 제공합니다</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>난이도별, 카테고리별 맞춤 질문을 제공합니다</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                size="lg"
                disabled={tokenInfo.remaining === 0}
              >
                <Link to="/ai-interview" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI 면접 시작하기
                </Link>
              </Button>
              {tokenInfo.remaining === 0 && (
                <p className="text-xs text-red-600 text-center">토큰을 충전해주세요</p>
              )}
            </div>
          </Card>
        </div>

        {/* 부가 기능 */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="mr-4">
            <Link to="/history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              면접 히스토리
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
