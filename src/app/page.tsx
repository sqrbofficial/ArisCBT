
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SplashPage() {
  return (
    <div className="relative flex h-dvh flex-col items-center justify-between bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] p-8 text-white">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="z-10 w-full flex-shrink-0">
        {/* Can be a placeholder for a more complex header if needed */}
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center">
        <h1 className="font-russo-one text-5xl font-extrabold tracking-normal md:text-7xl">
          ArisCBT
        </h1>
      </div>

      <div className="z-10 flex w-full flex-shrink-0 justify-center">
        <Button
          asChild
          size="lg"
          className="w-full max-w-sm rounded-full py-6 text-lg font-semibold"
        >
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
