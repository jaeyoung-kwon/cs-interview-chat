
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuestionManager from "./pages/QuestionManager";
import BasicInterview from "./pages/BasicInterview";
import AIInterview from "./pages/AIInterview";
import ComparisonResult from "./pages/ComparisonResult";
import InterviewHistory from "./pages/InterviewHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questions" element={<QuestionManager />} />
          <Route path="/basic-interview" element={<BasicInterview />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/comparison" element={<ComparisonResult />} />
          <Route path="/history" element={<InterviewHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
