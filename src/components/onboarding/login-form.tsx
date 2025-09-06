'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GoogleLogo } from '../icons/google-logo';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginUser, storeToken, storeRefreshToken } from '@/lib/auth';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setAuth } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await loginUser(values);
      storeToken(response.access_token);
      if (response.refresh_token) {
        storeRefreshToken(response.refresh_token);
      }
      setAuth(response.access_token);
      // Use replace instead of push to prevent back navigation to login
      router.replace('/dashboard');
    } catch (error) {
      console.error(error);
      // TODO: Add error toast here
      form.setError('root', { 
        message: 'Login failed. Please check your credentials and try again.' 
      });
    }
  }

  async function handleGoogleSignIn() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/v1/auth/google`);
    const data = await response.json();
    window.location.href = data.url;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
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
          variant="outline"
          type="button"
          onClick={handleGoogleSignIn}
        >
          <GoogleLogo className="mr-2 h-4 w-4" />
          Google
        </Button>
      </form>
    </Form>
  );
}