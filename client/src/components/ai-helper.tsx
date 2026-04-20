import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useExplain } from "@/hooks/use-ai";
import ReactMarkdown from 'react-markdown';

interface AiHelperProps {
  topicContext: string;
}

export function AiHelper({ topicContext }: AiHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  
  const { mutate: explain, isPending } = useExplain();

  const handleExplain = () => {
    if (!query.trim()) return;
    
    explain(
      { text: query, context: topicContext },
      {
        onSuccess: (data) => {
          setResponse(data.explanation);
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90 text-white z-50 p-0 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <SheetTitle className="flex items-center gap-2 text-accent">
            <Sparkles className="w-5 h-5" />
            AI Study Assistant
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <ScrollArea className="flex-1 p-6">
            {!response && !isPending && (
              <div className="text-center py-10 px-4 text-muted-foreground">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">How can I help?</h3>
                <p>Ask me to explain a concept, simplify a paragraph, or give examples related to this topic.</p>
              </div>
            )}
            
            {isPending && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-muted-foreground animate-pulse">Thinking...</p>
              </div>
            )}

            {response && (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-accent/5 p-4 rounded-xl border border-accent/10">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border bg-background">
            <div className="relative">
              <Textarea
                placeholder="Ask a question about this topic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-12 resize-none min-h-[80px] rounded-xl focus-visible:ring-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleExplain();
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute bottom-2 right-2 bg-accent hover:bg-accent/90 text-white h-8 w-8 p-0 rounded-lg"
                onClick={handleExplain}
                disabled={isPending || !query.trim()}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
