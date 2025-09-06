
"use client";

import { useState, useEffect, useCallback } from 'react';
import LandingPage from '@/components/landing-page';
import BirthChartForm from '@/components/onboarding/birth-chart-form';
import Dashboard from '@/components/dashboard/dashboard';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/auth-context';
import { getUserCharts } from '@/lib/chart-api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [appState, setAppState] = useState<'loading' | 'landing' | 'onboarding' | 'dashboard'>('loading');
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const checkUserAndCharts = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setAppState('landing');
      return;
    }

    try {
      const userCharts = await getUserCharts();
      if (userCharts && userCharts.length > 0) {
        setAppState('dashboard');
      } else {
        setAppState('onboarding');
      }
    } catch (error) {
      console.error("Error fetching user charts:", error);
      setAppState('onboarding'); // If charts fail to load, prompt for onboarding
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    checkUserAndCharts();
  }, [checkUserAndCharts]);

  const handleChartCreated = () => {
    setAppState('dashboard');
  };

  const handleLogout = () => {
    logout();
    setAppState('landing');
    router.push('/');
  };

  const renderContent = () => {
    if (authLoading || appState === 'loading') {
      return <div>Loading...</div>;
    }

    switch (appState) {
      case 'onboarding':
        return <BirthChartForm onChartCreated={handleChartCreated} />;
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />;
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
