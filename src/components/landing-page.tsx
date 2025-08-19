"use client";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/icons/google-logo";
import { Logo } from "@/components/icons/logo";

type LandingPageProps = {
  onSignIn: () => void;
};

export default function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.2),rgba(255,255,255,0))] animate-breathing-bg"></div>
      <div className="flex flex-col items-center gap-4 mb-8">
        <Logo className="h-16 w-16 text-primary animate-pulse-slow" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
          Cosmic Insights AI
        </h1>
      </div>
      <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
        Discover what the stars say about you. Your personal AI astrologer awaits.
      </p>
      <Button onClick={onSignIn} size="lg" className="shadow-lg shadow-primary/20">
        <GoogleLogo className="mr-2 h-6 w-6" />
        Continue with Google
      </Button>
    </main>
  );
}
