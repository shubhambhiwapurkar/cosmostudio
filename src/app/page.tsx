
"use client";

import { useState } from 'react';
import type { BirthData } from '@/lib/types';
import LandingPage from '@/components/landing-page';
import BirthChartForm from '@/components/onboarding/birth-chart-form';
import Dashboard from '@/components/dashboard/dashboard';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [appState, setAppState] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  const handleSignIn = () => {
    setAppState('onboarding');
  };

  const handleFormSubmit = (data: BirthData) => {
    setBirthData(data);
    setAppState('dashboard');
  };

  const handleReset = () => {
    setBirthData(null);
    setAppState('landing');
  }

  const renderContent = () => {
    switch (appState) {
      case 'onboarding':
        return <BirthChartForm onSubmit={handleFormSubmit} />;
      case 'dashboard':
        return birthData ? <Dashboard birthData={birthData} onReset={handleReset} /> : <LandingPage onSignIn={handleSignIn} />;
      case 'landing':
      default:
        return <LandingPage onSignIn={handleSignIn} />;
    }
  };

  return (
    <>
      {renderContent()}
      <Toaster />
    </>
  );
}
