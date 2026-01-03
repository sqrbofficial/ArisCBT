'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/ui/logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Non-blocking call
    initiateEmailSignIn(auth, values.email, values.password);
    
    // We don't await, so we can't use a try-catch here.
    // Auth state changes are handled by the global onAuthStateChanged listener.
    // We optimistically assume it might work but prepare for errors via the listener.
    toast({
      title: 'Signing In...',
      description: 'Please wait while we log you in.',
    });

    // A real implementation would handle errors from onAuthStateChanged
    // and maybe set a timeout to re-enable the button if login stalls.
    // For now, we assume the global listener will redirect on success.
  };

   const handleAnonymousSignIn = () => {
    setIsSubmitting(true);
    initiateAnonymousSignIn(auth);
    toast({
      title: 'Signing In Anonymously...',
      description: 'You are being signed in as a guest.',
    });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-headline text-2xl font-bold">ArisCBT</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue your journey.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      autoComplete="email"
                      {...field}
                    />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login
            </Button>
          </form>
        </Form>
        
        <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-xs text-muted-foreground">OR</span>
        </div>

        <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isSubmitting}>
          Continue as Guest
        </Button>


        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
