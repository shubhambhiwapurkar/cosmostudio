"use client";

import { useState, useEffect } from 'react';
import LandingPage from '@/components/landing-page';
import BirthChartForm from '@/components/onboarding/birth-chart-form';
import Dashboard from '@/components/dashboard/dashboard';
import type { BirthData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [step, setStep] = useState<'loading' | 'landing' | 'onboarding' | 'dashboard'>('loading');
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('birthData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Basic validation of stored data
        if (parsedData.dateOfBirth && parsedData.timeOfBirth && parsedData.placeOfBirth) {
            setBirthData({
                ...parsedData,
                dateOfBirth: new Date(parsedData.dateOfBirth)
            });
            setStep('dashboard');
            return;
        }
      }
    } catch (error) {
        console.error("Failed to parse birth data from localStorage", error);
        localStorage.removeItem('birthData');
    }
    setStep('landing');
  }, []);

  const handleSignIn = () => {
    setStep('onboarding');
  };

  const handleFormSubmit = (data: BirthData) => {
    try {
        localStorage.setItem('birthData', JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save birth data to localStorage", error);
    }
    setBirthData(data);
    setStep('dashboard');
  };

  const handleReset = () => {
    localStorage.removeItem('birthData');
    setBirthData(null);
    setStep('landing');
  }

  if (step === 'loading') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-4 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/2 mx-auto" />
            </div>
        </div>
    );
  }

  if (step === 'landing') {
    return <LandingPage onSignIn={handleSignIn} />;
  }

  if (step === 'onboarding') {
    return <BirthChartForm onSubmit={handleFormSubmit} />;
  }
  
  if (step === 'dashboard' && birthData) {
    return <Dashboard birthData={birthData} onReset={handleReset} />;
  }

  return <LandingPage onSignIn={handleSignIn} />;
}
