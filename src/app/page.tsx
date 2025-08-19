
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
          throw new Error('Not authenticated');
        }
        const user = await res.json();


  const handleReset = () => {
    setBirthData(null);
    setAppState('landing');
  }

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <div>Loading...</div>; // Or a loading spinner component
      case 'onboarding':
        return <BirthChartForm onSubmit={handleFormSubmit} />;
      case 'dashboard':
        return birthData ? <Dashboard birthData={birthData} onReset={handleReset} /> : <div>Error: Birth data not available.</div>; // Should not happen if logic is correct
      case 'landing':
      default:
        return <LandingPage />; // onSignIn prop removed
    }
  };


        if (user && user.birthChart) {
          // Assuming the birthChart field in the user object contains the necessary BirthData
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
  }, []); // Run only once on component mount

  const handleFormSubmit = (data: BirthData) => {
    const saveBirthChart = async () => {
      try {
        const res = await fetch('/api/birthchart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const savedBirthChart = await res.json();
        setBirthData(savedBirthChart);
        setAppState('dashboard');
      } catch (error) {
        console.error("Error saving birth chart:", error);
      }
    };
    saveBirthChart();
  };

  return (
    <>
      {renderContent()}
      <Toaster />
    </>
  );
}
