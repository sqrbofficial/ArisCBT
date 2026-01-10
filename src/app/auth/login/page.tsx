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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props}><path d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.8 244 12.8c70.3 0 129.8 27.8 174.4 72.4l-69.8 69.8c-21.8-20.8-53.2-33.8-94.6-33.8-74.8 0-135.8 61.2-135.8 136.8 0 75.6 61.2 136.8 135.8 136.8 88.8 0 123.8-63.2 127.4-95.2H244V252.8h244v9z"/></svg>
)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" {...props}><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
)
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.2c0 61.6 31.5 112.9 80.7 156.8 31.5 27.2 64.1 42.6 101.4 42.6 30.9 0 62.6-14.3 89.4-14.3 27.9 0 59.5 14.3 88.4 14.3 33.7 0 74.3-21.5 103.3-32.5-33.7-20.3-67.6-36.6-67.6-36.6-.1-.1 0-.1 0-.1zM192 422.3c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg>
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] p-4 text-white">
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

            <div className="flex justify-center gap-4">
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 border-white/20 hover:bg-white/20">
                    <GoogleIcon className="h-6 w-6" fill="white"/>
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 border-white/20 hover:bg-white/20">
                    <FacebookIcon className="h-6 w-6" fill="white" />
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 border-white/20 hover:bg-white/20">
                    <AppleIcon className="h-6 w-6" fill="white" />
                </Button>
            </div>

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
                                className="h-14 rounded-full border-white/20 bg-black/30 pl-12 text-base text-white placeholder:text-white/50 focus:ring-offset-[#A54A41]"
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
                                className="h-14 rounded-full border-white/20 bg-black/30 pl-12 text-base text-white placeholder:text-white/50 focus:ring-offset-[#A54A41]"
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


                <Button type="submit" size="lg" className="w-full !mt-6 h-14 rounded-full bg-[#A54A41] text-lg font-semibold text-white hover:bg-[#A54A41]/90 focus:ring-offset-background" disabled={isSubmitting}>
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
