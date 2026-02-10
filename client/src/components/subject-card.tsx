import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Book, Calculator, FlaskConical, Globe, Microscope, Palette, Quote } from "lucide-react";
import type { Subject } from "@shared/schema";

// Map icons
const iconMap: Record<string, any> = {
  "book": Book,
  "calculator": Calculator,
  "flask-conical": FlaskConical,
  "globe": Globe,
  "microscope": Microscope,
  "palette": Palette,
  "quote": Quote,
};

interface SubjectCardProps {
  subject: Subject & { progress: number; topicCount: number };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || Book;

  return (
    <Link href={`/subjects/${subject.slug}`}>
      <div className="group bg-card hover:bg-card/50 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="w-6 h-6" />
          </div>
          <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
            {subject.topicCount} Topics
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {subject.name}
        </h3>
        
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="text-foreground font-bold">{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className="h-2 bg-muted" />
        </div>
      </div>
    </Link>
  );
}
