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
import { Lock, User } from 'lucide-react';
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] p-4 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="z-10 w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center text-center">
                <h1 className="font-russo-one text-5xl font-extrabold tracking-normal">
                    ArisCBT
                </h1>
                <p className="mt-2 text-white/80">
                    Reset Your Password
                </p>
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                         <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                type="email"
                                placeholder="Enter Your Email"
                                autoComplete="email"
                                className="h-14 rounded-full border-white/20 bg-black/30 pl-12 text-base text-white placeholder:text-white/50"
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" size="lg" className="w-full !mt-6 h-14 rounded-full text-lg font-semibold text-white" disabled={isSubmitting}>
                    Send Reset Link
                </Button>
            </form>
            </Form>
            <div className="mt-6 text-center text-sm text-white/80">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-semibold text-white hover:underline">
                    Login
                </Link>
            </div>
        </div>
    </div>
  );
}
