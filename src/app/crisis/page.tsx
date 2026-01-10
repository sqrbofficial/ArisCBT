'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Search, Siren, Globe } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { hotlines, HotlineResource } from '@/lib/hotlines';
import { useMemo } from 'react';
import AppShell from '@/components/layout/app-shell';
import { SidebarTrigger } from '@/components/ui/sidebar';

const internationalResources = [
  {
    title: 'Crisis Text Line',
    icon: MessageSquare,
    details: 'Text HOME to 741741',
    action: 'Text HOME',
    href: 'sms:741741?&body=HOME',
    info: 'International - 24/7 Confidential Support',
  },
  {
    title: 'International Crisis Directory',
    icon: Globe,
    details: 'Find a local crisis center anywhere in the world.',
    action: 'Find Local Help',
    href: 'https://findahelpline.com/',
    info: 'Global Directory',
  },
];

export default function CrisisPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  
  const { data: userData, isLoading: isUserDataLoading } = useDoc<{ country: string }>(userDocRef);

  const userCountryCode = userData?.country;

  const userHotlines = useMemo(() => {
    if (!userCountryCode || !hotlines[userCountryCode]) {
      return [];
    }
    return hotlines[userCountryCode];
  }, [userCountryCode]);

  const isLoading = isUserLoading || isUserDataLoading;

  const getIcon = (type: string) => {
    switch(type) {
      case 'phone': return Phone;
      case 'text': return MessageSquare;
      default: return Search;
    }
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] text-white">
        <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-4 self-start">
                <SidebarTrigger className="md:hidden" />
                <h1 className="flex items-center gap-2 font-headline text-3xl font-bold text-destructive">
                Immediate Help <Siren className="h-7 w-7" />
                </h1>
            </div>
          <p className="max-w-2xl text-white/80">
            If you are in crisis, you are not alone. Please use these resources to
            get immediate, confidential help. Your safety is the priority.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {userHotlines.length > 0 && (
              <div className='lg:px-20 xl:px-40'>
                <h2 className="mb-4 text-center font-headline text-2xl font-bold">
                  Resources for {hotlines[userCountryCode!][0].countryName}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {userHotlines.map((resource) => (
                    <ResourceCard key={resource.title} resource={resource} icon={getIcon(resource.type)} />
                  ))}
                </div>
                <hr className="my-8 border-white/20" />
              </div>
            )}
            
            <div className="lg:px-20 xl:px-40">
              <h2 className="mb-4 text-center font-headline text-2xl font-bold">
                  International Resources
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {internationalResources.map((resource) => (
                  <ResourceCard key={resource.title} resource={resource} icon={resource.icon} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

type ResourceCardProps = {
    resource: {
        title: string;
        details: string;
        action: string;
        href: string;
        info: string;
    },
    icon: React.ElementType
}

const ResourceCard = ({ resource, icon: Icon }: ResourceCardProps) => {
    return (
        <Card
            className="flex flex-col border-destructive/50 text-center transition-all hover:shadow-lg bg-black/30 text-white"
        >
            <CardHeader className="items-center">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-white/80" />
                <CardTitle className="text-xl">{resource.title}</CardTitle>
            </div>
            <CardDescription className="text-white/80">{resource.details}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
            <Button
                asChild
                className="rounded-full px-8 py-6 text-lg"
                variant="destructive"
            >
                <Link href={resource.href} target="_blank">
                {resource.action}
                </Link>
            </Button>
            </CardContent>
            <CardFooter className="justify-center text-sm text-white/80">
            {resource.info}
            </CardFooter>
        </Card>
    )
}
