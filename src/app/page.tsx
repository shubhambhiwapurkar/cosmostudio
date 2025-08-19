
"use client";

import { useState, useEffect } from 'react';
import type { BirthData } from '@/lib/types';
import LandingPage from '@/components/landing-page';
import BirthChartForm from '@/components/onboarding/birth-chart-form';
import Dashboard from '@/components/dashboard/dashboard';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [appState, setAppState] = useState<'loading' | 'landing' | 'onboarding' | 'dashboard'>('loading');
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/current_user');
        if (!res.ok) {
          // It's normal for this to fail if the user is not logged in
          setAppState('landing');
          return;
        }
        const user = await res.json();

        if (user && user.birthChart) {
          setBirthData(user.birthChart);
          setAppState('dashboard');
        } else if (user) {
          setAppState('onboarding');
        } else {
          setAppState('landing');
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAppState('landing');
      }
    };

    checkUser();
  }, []);

  const handleFormSubmit = async (data: BirthData) => {
    try {
      const res = await fetch('/api/birthchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to save birth chart');
      }

      const savedBirthChart = await res.json();
      setBirthData(savedBirthChart);
      setAppState('dashboard');
    } catch (error) {
      console.error("Error saving birth chart:", error);
      // Optionally show an error toast to the user here
    }
  };

  const handleReset = () => {
    // Here you would also call the logout endpoint
    fetch('/api/logout');
    setBirthData(null);
    setAppState('landing');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <div>Loading...</div>; // You can replace this with a nice spinner component
      case 'onboarding':
        return <BirthChartForm onSubmit={handleFormSubmit} />;
      case 'dashboard':
        // The check for birthData is important here
        return birthData ? <Dashboard birthData={birthData} onReset={handleReset} /> : <div>Loading Dashboard...</div>;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      {renderContent()}
      <Toaster />
    </>
  );
}
