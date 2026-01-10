'use client';

import ChatInterface from "@/components/chat-interface";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
       <div className="flex h-full flex-col bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] text-white">
        <header className="flex items-center justify-between p-4 flex-shrink-0">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-bold">ArisCBT</h1>
            <Button variant="ghost" size="icon">
                <MoreVertical />
            </Button>
        </header>
        <ChatInterface chatId={chatId} />
      </div>
  );
}
