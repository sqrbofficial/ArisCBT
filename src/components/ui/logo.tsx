import React from 'react';
import { cn } from '@/lib/utils';

type LogoProps = React.SVGProps<SVGSVGElement>;

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      {...props}
    >
      <rect width="48" height="48" rx="8" fill="#0052CC"/>
      <path
        d="M24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38Z"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.5 15.5C30.5 17.5 27.5 18.5 24.5 18.5"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 15.5C17.5 17.5 20.5 18.5 23.5 18.5"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 30V26"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9999 28.5L24.4999 23.5C25.4999 24.5 27.4999 26 27.4999 28C27.4999 30 25.4999 32 23.4999 32C21.4999 32 18.9999 30 19.9999 28C20.4999 27 20.9999 28.5 20.9999 28.5Z"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 23H25"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 22V24"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 11H39"
        stroke="#FF69B4"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 8V14"
        stroke="#FF69B4"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
