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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.565-3.108-11.127-7.481l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.578,36.686,48,30.73,48,24C48,22.659,47.862,21.35,47.611,20.083z"/></svg>
)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" {...props}><path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.69H8.031v-2.822h2.474v-2.18c0-2.45,1.442-3.791,3.67-3.791c1.06,0,2.145,0.189,2.145,0.189v2.484h-1.291c-1.21,0-1.59,0.75-1.59,1.524v1.774h2.783l-0.448,2.822h-2.335v7.187C18.307,21.153,22,17.013,22,12C22,6.477,17.523,2,12,2z" fillRule="evenodd" clipRule="evenodd"></path></svg>
)
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" {...props}><path d="M 14.726562 0.5 C 13.0625 0.535156 11.449219 1.402344 10.5 2.5 C 9.554688 1.398438 7.910156 0.523438 6.25 0.5 C 4.585938 0.519531 2.433594 1.515625 1.480469 3.390625 C -0.429688 6.960938 1.042969 11.835938 3.011719 14.808594 C 4.027344 16.320312 5.390625 17.960938 7.03125 18 C 8.671875 18.035156 9.203125 17.183594 11.25 17.183594 C 13.292969 17.183594 13.785156 18.035156 15.46875 18 C 17.152344 17.960938 18.523438 16.355469 19.53125 14.820312 C 20.613281 13.210938 21.238281 11.46875 21.320312 11.410156 C 21.230469 11.40625 18.011719 10.109375 17.960938 7 C 17.914062 4.417969 20.109375 3.03125 20.300781 2.839844 C 18.730469 0.941406 16.515625 0.460938 14.726562 0.5 Z M 13.125 19.3125 C 12.316406 20.910156 11.386719 22.953125 10 23.5 L 10 23.5 C 9.992188 23.503906 10.007812 23.503906 10.015625 23.5 L 10.046875 23.496094 C 10.058594 23.492188 10.0625 23.492188 10.070312 23.488281 C 11.53125 22.585938 12.550781 20.589844 13.375 18.9375 C 13.5625 18.539062 13.910156 18.070312 14.375 17.9375 C 14.8125 17.8125 15.652344 17.914062 16.25 18.53125 C 16.4375 18.71875 16.601562 18.917969 16.75 19.125 C 15.683594 19.71875 14.410156 19.8125 13.125 19.3125 Z"></path></svg>
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
                    <GoogleIcon className="h-6 w-6"/>
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
