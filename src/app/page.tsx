'use client';

import ChatInterface from "@/components/chat-interface";
import { useUser } from "@/firebase";
import LoginPage from "./auth/login/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
  }
  
  if (!user) {
    return <LoginPage />;
  }

  return <ChatInterface />;
}
