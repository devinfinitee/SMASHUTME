import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold font-display text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The topic or page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full px-8">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
