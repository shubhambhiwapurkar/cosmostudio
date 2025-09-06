'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import Dashboard from '@/components/dashboard/dashboard';
import { BirthData } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { getValidToken } = useAuth();
  const router = useRouter();
  const [birthData, setBirthData] = useState<BirthData>({
    dateOfBirth: new Date(),
    timeOfBirth: "12:00",
    placeOfBirth: ""
  });

  // Load user's birth data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await getValidToken();
        if (!token) {
          router.push('/');
          return;
        }
        // TODO: Add API call to get user's birth data
        // const userData = await getUserData(token);
        // setBirthData(userData.birthData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [getValidToken, router]);

  return (
    <ProtectedRoute>
      <Dashboard 
        birthData={birthData} 
        onReset={() => {
          setBirthData({
            dateOfBirth: new Date(),
            timeOfBirth: "12:00",
            placeOfBirth: ""
          });
        }} 
      />
    </ProtectedRoute>
  );
}
