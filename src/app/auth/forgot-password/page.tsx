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
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${values.email}, a password reset link has been sent to it.`,
      });
      form.reset();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
            <div className="flex flex-col items-center text-center mb-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold">ArisCBT</span>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
                <p className="text-muted-foreground">
                    Enter your email to receive a password reset link.
                </p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="your@email.com"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Send Reset Link
                </Button>
            </form>
            </Form>
            <div className="mt-6 text-center text-sm">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                    Login
                </Link>
            </div>
        </div>
    </div>
  );
}
