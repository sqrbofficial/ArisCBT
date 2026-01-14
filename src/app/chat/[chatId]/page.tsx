'use client';

import ChatInterface from "@/components/chat-interface";
import { useUser } from "@/firebase";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import AppShell from "@/components/layout/app-shell";

export default function ChatSessionPage() {
  // All hooks are called unconditionally at the top.
  const { user, isUserLoading } = useUser();
  const params = useParams();
  
  // Logic is performed after hooks.
  const chatId = params.chatId as string;
  const isLoading = isUserLoading || !user || !chatId;

  // Conditional rendering happens only in the return statement.
  return (
    <AppShell>
      {isLoading ? (
        <div className="flex h-dvh w-full items-center justify-center bg-app-gradient-dark dark:bg-app-gradient-dark">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="flex h-full flex-col bg-app-gradient-dark dark:bg-app-gradient-dark text-white">
          <header className="flex items-center justify-between p-4 flex-shrink-0">
              <h1 className="text-xl font-bold">ArisCBT</h1>
              <Button variant="ghost" size="icon">
                  <MoreVertical />
              </Button>
          </header>
          <ChatInterface chatId={chatId} />
        </div>
      )}
    </AppShell>
  );
}
