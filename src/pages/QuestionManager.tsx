
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Question, Difficulty } from '@/types/interview';
import { toast } from "@/hooks/use-toast";

const QuestionManager = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ 
    question: '', 
    category: '', 
    expectedAnswer: '', 
    difficulty: '' as Difficulty | '',
    keywords: ''
  });

  useEffect(() => {
    const savedQuestions = localStorage.getItem('interview-questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const saveQuestions = (updatedQuestions: Question[]) => {
    localStorage.setItem('interview-questions', JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (!newQuestion.question || !newQuestion.category || !newQuestion.expectedAnswer || !newQuestion.difficulty) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      category: newQuestion.category,
      expectedAnswer: newQuestion.expectedAnswer,
      difficulty: newQuestion.difficulty as Difficulty,
      keywords: newQuestion.keywords ? newQuestion.keywords.split(',').map(k => k.trim()) : [],
      createdAt: new Date()
    };

    const updatedQuestions = [...questions, question];
    saveQuestions(updatedQuestions);
    setNewQuestion({ question: '', category: '', expectedAnswer: '', difficulty: '', keywords: '' });
    
    toast({
      title: "질문 추가 완료",
      description: "새로운 질문이 등록되었습니다."
    });
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    saveQuestions(updatedQuestions);
    
    toast({
      title: "질문 삭제 완료",
      description: "질문이 삭제되었습니다."
    });
  };

  const categories = ['JavaScript', 'CS', 'React', '데이터베이스', '네트워크', '운영체제'];
  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'beginner', label: '초급', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: '중급', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: '고급', color: 'bg-red-100 text-red-800' }
  ];

  const getDifficultyInfo = (difficulty: Difficulty) => {
    return difficulties.find(d => d.value === difficulty) || difficulties[0];
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
            <h1 className="text-xl font-bold text-gray-900">질문 관리</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 질문 추가 폼 */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">새 질문 추가</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">카테고리</label>
              <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, category: value }))}>
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
              <label className="block text-sm font-medium mb-2">난이도</label>
              <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, difficulty: value as Difficulty }))}>
                <SelectTrigger>
                  <SelectValue placeholder="난이도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      <span className={`px-2 py-1 rounded text-xs ${diff.color}`}>
                        {diff.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">            
            <div>
              <label className="block text-sm font-medium mb-2">질문</label>
              <Textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="면접 질문을 입력하세요"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">예상 답변</label>
              <Textarea
                value={newQuestion.expectedAnswer}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, expectedAnswer: e.target.value }))}
                placeholder="이 질문에 대한 예상 답변을 입력하세요"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">핵심 키워드 (쉼표로 구분)</label>
              <Input
                value={newQuestion.keywords}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="HTTP, HTTPS, 보안, 암호화"
              />
            </div>
            
            <Button onClick={addQuestion} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              질문 추가
            </Button>
          </div>
        </Card>

        {/* 등록된 질문 목록 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">등록된 질문 ({questions.length}개)</h2>
          
          {questions.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              등록된 질문이 없습니다. 첫 번째 질문을 추가해보세요!
            </Card>
          ) : (
            questions.map((question) => {
              const diffInfo = getDifficultyInfo(question.difficulty);
              return (
                <Card key={question.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {question.category}
                      </Badge>
                      <Badge className={diffInfo.color}>
                        {diffInfo.label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-medium mb-2">{question.question}</h3>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>예상 답변:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{question.expectedAnswer}</p>
                  </div>

                  {question.keywords && question.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">키워드:</span>
                      {question.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionManager;
