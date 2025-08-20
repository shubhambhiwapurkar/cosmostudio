
"use client";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/icons/google-logo";
import { Logo } from "@/components/icons/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './onboarding/login-form';
import { RegisterForm } from './onboarding/register-form';

// Removed the LandingPageProps type and onSignIn prop
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.2),rgba(255,255,255,0))] animate-breathing-bg"></div>
      <div className="flex flex-col items-center gap-4 mb-8">
        <Logo className="h-16 w-16 text-primary animate-pulse-slow" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
          Astra AI
        </h1>
      </div>
      <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
        Discover what the stars say about you. Your personal AI astrologer awaits.
      </p>
      <div className="w-full max-w-md space-y-4">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            window.location.href = '/api/auth/google';
          }}
        >
          <GoogleLogo />
          Register with Google
        </Button>
      </div>
    </main>
  );
}

    