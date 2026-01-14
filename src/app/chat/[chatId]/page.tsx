'use client';

import ChatInterface from "@/components/chat-interface";
import { useUser } from "@/firebase";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreVertical, SidebarTrigger } from "lucide-react";
import AppShell from "@/components/layout/app-shell";

export default function ChatSessionPage() {
  const { user, isUserLoading } = useUser();
  const params = useParams();

  const chatId = params.chatId as string;
  const isLoading = isUserLoading || !chatId || !user;

  return (
    <AppShell>
      {isLoading ? (
        <div className="flex h-dvh w-full items-center justify-center bg-app-gradient-dark dark:bg-app-gradient-dark">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="flex h-full flex-col bg-app-gradient-dark dark:bg-app-gradient-dark text-white">
          <header className="flex items-center justify-between p-4 flex-shrink-0">
              <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="text-xl font-bold">ArisCBT</h1>
              </div>
              <Button variant="ghost" size="icon">
                  <MoreVertical />
              </Button>
          </header>
          {/* We ensure ChatInterface only renders when both user and chatId are available */}
          {user && chatId && <ChatInterface chatId={chatId} />}
        </div>
      )}
    </AppShell>
  );
}
