'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { getCurrentUser, deleteAccount } from '@/lib/user-api';
import { User } from '@/lib/types';
import UserProfile from '@/components/dashboard/user-profile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        router.push('/login');
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data.');
        toast({
          title: "Error",
          description: err.message || "Failed to fetch user data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, router, toast]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast({
        title: "Success",
        description: "Account successfully deleted.",
      });
      logout();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete account.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ProtectedRoute><div className="flex items-center justify-center h-screen">Loading user profile...</div></ProtectedRoute>;
  }

  if (error) {
    return <ProtectedRoute><div className="flex items-center justify-center h-screen text-red-500">{error}</div></ProtectedRoute>;
  }

  if (!user) {
    return <ProtectedRoute><div className="flex items-center justify-center h-screen">No user data found.</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <UserProfile user={user} />

        <div className="mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}