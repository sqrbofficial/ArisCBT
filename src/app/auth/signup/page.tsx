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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { Bot, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { countries } from '@/lib/countries';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  country: z.string().min(1, { message: 'Please select your country.' }),
});

export default function SignUpPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      country: '',
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
        country: values.country,
        createdAt: serverTimestamp(),
      };
      
      // Non-blocking write to Firestore
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      toast({
        title: 'Account Created!',
        description: 'You have been successfully signed up.',
      });
      // The onAuthStateChanged listener will handle the redirect.
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.code === 'auth/email-already-in-use'
          ? 'This email is already associated with an account.'
          : 'An error occurred during sign up. Please try again.',
      });
      setIsSubmitting(false);
    }
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
                <Bot className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl font-bold">ArisCBT</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground">
                Join ArisCBT to begin your therapy journey.
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
                    <Input type="email" placeholder="your@email.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Country</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "justify-between font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value
                                ? countries.find(
                                    (country) => country.value === field.value
                                )?.label
                                : "Select your country"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                {countries.map((country) => (
                                    <CommandItem
                                    value={country.label}
                                    key={country.value}
                                    onSelect={() => {
                                        form.setValue("country", country.value)
                                        setPopoverOpen(false)
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        country.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                    />
                                    {country.label}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                              </CommandList>
                          </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create Account
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
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
