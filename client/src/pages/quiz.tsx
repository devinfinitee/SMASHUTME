import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useTopic, useSubmitQuiz } from "@/hooks/use-topics";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function Quiz() {
  const [, params] = useRoute("/topics/:slug/quiz");
  const { data: topic, isLoading } = useTopic(params?.slug || "");
  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (isLoading) return <div className="flex justify-center pt-20"><Skeleton className="h-96 w-full max-w-2xl rounded-2xl" /></div>;
  if (!topic || !topic.questions || topic.questions.length === 0) return <div className="text-center pt-20">No questions available for this quiz.</div>;

  const currentQuestion = topic.questions[currentQuestionIndex];
  const totalQuestions = topic.questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleOptionSelect = (key: string) => {
    if (showResult) return;
    setSelectedOption(key);
  };

  const checkAnswer = () => {
    setShowResult(true);
    if (selectedOption === currentQuestion.correctOption) {
      setScore(s => s + 1);
      // Small burst of confetti for correct answer
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#4ade80']
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    // Final score is score + 1 if the last answer was correct, but React state update is async
    // So we use a local calculation
    const finalScore = selectedOption === currentQuestion.correctOption ? score + 1 : score;
    
    if (finalScore / totalQuestions > 0.7) {
       confetti({
         particleCount: 150,
         spread: 70,
         origin: { y: 0.6 }
       });
    }

    submitQuiz({
      topicId: topic.id,
      score: finalScore,
      totalQuestions
    });
  };

  if (quizCompleted) {
    const finalScore = selectedOption === currentQuestion.correctOption ? score + 1 : score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    return (
      <div className="max-w-md mx-auto pt-10 text-center animate-slide-in">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-primary">{percentage}%</span>
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-8">
            You scored {finalScore} out of {totalQuestions}
          </p>
          
          <div className="space-y-3">
            <Link href={`/topics/${topic.slug}`}>
              <Button variant="outline" className="w-full h-12 rounded-xl">
                Review Topic
              </Button>
            </Link>
            <Link href={`/subjects/${topic.subject.slug}`}>
              <Button className="w-full h-12 rounded-xl">
                Back to Subject
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href={`/topics/${topic.slug}`}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <XCircle className="w-5 h-5 mr-2" />
            Quit
          </Button>
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Question Card */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold font-display leading-relaxed">
          {currentQuestion.content}
        </h2>

        <div className="space-y-3">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isSelected = selectedOption === key;
            const isCorrect = key === currentQuestion.correctOption;
            
            let cardClass = "bg-card border-border hover:border-primary/50";
            let icon = <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">{key}</div>;
            
            if (showResult) {
              if (isCorrect) {
                cardClass = "bg-green-500/10 border-green-500 text-green-700 dark:text-green-300";
                icon = <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
              } else if (isSelected) {
                cardClass = "bg-red-500/10 border-red-500 text-red-700 dark:text-red-300";
                icon = <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
              }
            } else if (isSelected) {
              cardClass = "bg-primary/5 border-primary ring-1 ring-primary";
              icon = <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{key}</div>;
            }

            return (
              <div
                key={key}
                onClick={() => handleOptionSelect(key)}
                className={cn(
                  "group p-4 rounded-xl border-2 flex items-center cursor-pointer transition-all duration-200",
                  cardClass,
                  !showResult && "hover:shadow-md"
                )}
              >
                <div className="mr-4">{icon}</div>
                <span className="font-medium text-lg">{String(value)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-10 md:static md:bg-transparent md:border-0 md:p-0 md:mt-10">
        <div className="max-w-2xl mx-auto">
          {!showResult ? (
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-xl shadow-lg"
              disabled={!selectedOption}
              onClick={checkAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-xl border border-border animate-slide-in">
                <p className="font-semibold mb-1">Explanation:</p>
                <p className="text-muted-foreground text-sm">
                  {currentQuestion.explanation || "No explanation provided."}
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-xl shadow-lg"
                onClick={nextQuestion}
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>Next Question <ArrowRight className="ml-2 w-5 h-5" /></>
                ) : (
                  <>Finish Quiz <Trophy className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
