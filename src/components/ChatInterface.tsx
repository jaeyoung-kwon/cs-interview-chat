
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Mic, MicOff, RotateCcw, Clock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
}

interface ChatInterfaceProps {
  onGoBack: () => void;
}

const ChatInterface = ({ onGoBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock CS questions database
  const csQuestions = {
    initial: [
      { question: "HTTP와 HTTPS의 차이점에 대해 설명해주세요.", category: "네트워크" },
      { question: "프로세스와 스레드의 차이점은 무엇인가요?", category: "운영체제" },
      { question: "데이터베이스의 ACID 속성에 대해 설명해주세요.", category: "데이터베이스" },
      { question: "배열과 연결리스트의 장단점을 비교해주세요.", category: "자료구조" },
      { question: "TCP와 UDP의 차이점은 무엇인가요?", category: "네트워크" }
    ],
    followUp: [
      "구체적인 예시를 들어 설명해주실 수 있나요?",
      "실무에서는 어떻게 활용되는지 말씀해주세요.",
      "다른 방법과 비교했을 때 어떤 장단점이 있을까요?",
      "성능 면에서는 어떤 차이가 있을까요?",
      "실제 프로젝트에서 경험해보신 적이 있나요?"
    ]
  };

  const addMessage = (content: string, type: 'user' | 'bot', category?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      category
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      if (!sessionStarted) {
        // First question
        const randomQuestion = csQuestions.initial[Math.floor(Math.random() * csQuestions.initial.length)];
        addMessage(
          `안녕하세요! CS 면접 시뮬레이션을 시작하겠습니다. 첫 번째 질문입니다.\n\n**[${randomQuestion.category}]**\n${randomQuestion.question}`,
          'bot',
          randomQuestion.category
        );
        setSessionStarted(true);
      } else {
        // Follow-up question
        const followUpQuestion = csQuestions.followUp[Math.floor(Math.random() * csQuestions.followUp.length)];
        const randomCategory = csQuestions.initial[Math.floor(Math.random() * csQuestions.initial.length)].category;
        
        setTimeout(() => {
          addMessage(followUpQuestion, 'bot');
          
          // Sometimes add a new question
          if (Math.random() > 0.5) {
            setTimeout(() => {
              const newQuestion = csQuestions.initial[Math.floor(Math.random() * csQuestions.initial.length)];
              addMessage(
                `다음 질문입니다.\n\n**[${newQuestion.category}]**\n${newQuestion.question}`,
                'bot',
                newQuestion.category
              );
            }, 2000);
          }
        }, 1000);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      simulateBotResponse(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (!isListening) {
        setIsListening(true);
        toast({
          title: "음성 인식 시작",
          description: "말씀해주세요...",
        });
        
        // Simulate voice input (in real implementation, use Web Speech API)
        setTimeout(() => {
          setIsListening(false);
          setInputValue("음성으로 입력된 답변입니다.");
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

  const startNewSession = () => {
    setMessages([]);
    setSessionStarted(false);
    setInputValue('');
    addMessage("새로운 면접 세션을 시작합니다. 준비되셨으면 아무 메시지나 보내주세요!", 'bot');
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Start with welcome message
    addMessage("CS 면접 시뮬레이션에 오신 것을 환영합니다! 준비되셨으면 아무 메시지나 보내주세요.", 'bot');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">CS 면접 시뮬레이션</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startNewSession}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              새 세션
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {messages.filter(m => m.type === 'user').length}개 답변
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Card className="h-full flex flex-col shadow-xl">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gray-600">면접관이 입력 중...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="답변을 입력하세요..."
                  className="pr-12 h-12 text-base"
                  disabled={isTyping}
                />
                <Button
                  type="button"
                  size="sm"
                  variant={isListening ? "destructive" : "ghost"}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={toggleVoiceInput}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="lg"
                className="h-12 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter로 전송 | 마이크 버튼으로 음성 입력
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
