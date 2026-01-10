'use client';

import ChatInterface from "@/components/chat-interface";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/layout/app-shell";

export default function ChatSessionPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || !chatId) {
    return (
        <div className="flex h-dvh w-full items-center justify-center bg-background">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
  }

  return (
    <AppShell>
      <ChatInterface chatId={chatId} />
    </AppShell>
  );
}
