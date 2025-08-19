import { Sparkles, Loader2 } from 'lucide-react';

export default function CalculatingChart() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in-0 duration-500">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-primary duration-3000" />
        <Sparkles className="absolute h-16 w-16 text-accent animate-pulse" />
      </div>
      <p className="mt-6 text-lg font-medium text-foreground tracking-wide">
        Aligning the stars...
      </p>
    </div>
  );
}
