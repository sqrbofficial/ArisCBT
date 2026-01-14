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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props}><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.8 244 12.8c70.3 0 129.8 27.8 174.4 72.4l-69.8 69.8c-21.8-20.8-53.2-33.8-94.6-33.8-74.8 0-135.8 61.2-135.8 136.8 0 75.6 61.2 136.8 135.8 136.8 88.8 0 123.8-63.2 127.4-95.2H244V252.8h244v9z"/></svg>
)

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
    initiateEmailSignIn(auth, values.email, values.password);
    toast({
      title: 'Signing In...',
      description: 'Please wait while we log you in.',
    });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-app-gradient p-4 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="z-10 w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="font-russo-one text-5xl font-extrabold tracking-normal">
                ArisCBT
            </h1>
            <p className="mt-2 text-white/80">
                Please Login To Your Account
            </p>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-base font-medium text-white">
                <GoogleIcon className="h-6 w-6 mr-4" />
                Sign in with Google
            </Button>

            <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-white/30"></div>
                <span className="mx-4 flex-shrink text-sm text-white/80">or</span>
                <div className="flex-grow border-t border-white/30"></div>
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                type="password"
                                placeholder="Enter Your Password"
                                autoComplete="current-password"
                                className="h-14 rounded-full border-white/20 bg-black/30 pl-12 text-base text-white placeholder:text-white/50"
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <div className="text-right">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-white/80 hover:text-white"
                    >
                        Forgot Password?
                    </Link>
                </div>


                <Button type="submit" size="lg" className="w-full !mt-6 h-14 rounded-full text-lg font-semibold" disabled={isSubmitting}>
                    Login
                </Button>
            </form>
            </Form>

            <div className="mt-6 text-center text-sm text-white/80">
            Don&apos;t Have Account?{' '}
            <Link href="/auth/signup" className="font-semibold text-white hover:underline">
                Sign Up
            </Link>
            </div>
        </div>
    </div>
  );
}
