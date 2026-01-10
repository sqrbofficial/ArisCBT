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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props}><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.8 244 12.8c70.3 0 129.8 27.8 174.4 72.4l-69.8 69.8c-21.8-20.8-53.2-33.8-94.6-33.8-74.8 0-135.8 61.2-135.8 136.8 0 75.6 61.2 136.8 135.8 136.8 88.8 0 123.8-63.2 127.4-95.2H244V252.8h244v9z"/></svg>
)

export default function SignUpPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: user.email,
        displayName: values.name,
        createdAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      toast({
        title: 'Account Created!',
        description: 'Welcome! Let\'s get you set up.',
      });
      
      router.push('/auth/onboarding');

    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.code === 'auth/email-already-in-use'
          ? 'This email is already associated with an account.'
          : 'An error occurred during sign up. Please try again.',
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
                Please Sign Up To Your Account
            </p>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-base font-medium text-white">
                <GoogleIcon className="h-6 w-6 mr-4" />
                Sign up with Google
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Enter Your Name"
                                autoComplete="name"
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
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
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
                                autoComplete="new-password"
                                className="h-14 rounded-full border-white/20 bg-black/30 pl-12 text-base text-white placeholder:text-white/50"
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Button type="submit" size="lg" className="w-full !mt-6 h-14 rounded-full text-lg font-semibold" disabled={isSubmitting}>
                    Create Account
                </Button>
            </form>
            </Form>

            <div className="mt-6 text-center text-sm text-white/80">
            Already Have Account?{' '}
            <Link href="/auth/login" className="font-semibold text-white hover:underline">
                Login
            </Link>
            </div>
        </div>
    </div>
  );
}
