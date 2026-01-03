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
import { doc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

const ageRanges = [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
    "Prefer not to say"
]

const formSchema = z.object({
  age: z.string().min(1, { message: 'Please select an age range.' }),
  country: z.string().min(1, { message: 'Please select your country.' }),
  state: z.string().optional(),
  affirmation: z.boolean().refine((val) => val === true, {
    message: 'You must affirm your primary residence.',
  }),
});

export default function OnboardingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      country: '',
      state: '',
      affirmation: false,
    },
  });

  const selectedCountry = form.watch('country');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to complete onboarding.",
        });
        return;
    }
    setIsSubmitting(true);
    
    const userDocRef = doc(firestore, 'users', user.uid);
    const userData = {
        age: values.age,
        country: values.country,
        state: values.state,
    };
    
    setDocumentNonBlocking(userDocRef, userData, { merge: true });

    toast({
      title: 'Information Saved!',
      description: "Thank you for telling us more about yourself.",
    });

    // For now, we just redirect. In the future, we can go to the next step.
    router.push('/');

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <Bot className="h-8 w-8" />
                <span className="font-headline text-2xl font-bold">ArisCBT</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Tell us about yourself</h1>
            <p className="text-muted-foreground mt-2">
                Please provide some basic information to help us serve you better.
            </p>
        </div>

        <Card className="p-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your age" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ageRanges.map(age => (
                                        <SelectItem key={age} value={age}>{age}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
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
                                        : "Select country"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
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
                                                setCountryPopoverOpen(false)
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
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="State/Province" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="affirmation"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 pt-0">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            I affirm I primarily reside in{' '}
                            <span className="font-bold">{countries.find(c => c.value === selectedCountry)?.label || '...'}</span>.
                            </FormLabel>
                        </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full !mt-8" size="lg" disabled={isSubmitting}>
                Continue
                </Button>
            </form>
            </Form>
        </Card>
      </div>
    </div>
  );
}
