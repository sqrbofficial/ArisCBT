
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="relative flex h-dvh flex-col items-center justify-between bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] p-8 text-white">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="z-10 w-full flex-shrink-0">
        {/* Can be a placeholder for a more complex header if needed */}
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center">
        <h1 className="flex items-center gap-2 text-5xl font-extrabold tracking-tight md:text-7xl">
          ArisCBT
        </h1>
      </div>

      <div className="z-10 w-full flex-shrink-0">
        <Button
          asChild
          size="lg"
          className="w-full max-w-sm mx-auto rounded-full bg-[#A54A41] py-6 text-lg font-semibold text-white hover:bg-[#A54A41]/90 focus-visible:ring-white"
        >
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
