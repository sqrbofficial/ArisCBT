'use client';

import { MessageSquareText, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { isToday, isWithinInterval, subDays } from 'date-fns';
import AppShell from '@/components/layout/app-shell';
import type { User } from 'firebase/auth';

type ChatSession = {
  id: string;
  title: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

const ChatGroup = ({ title, chats, onDelete }: ChatGroupProps) => {
  return (
    <div>
      <h3 className="text-md font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {chats.map(chat => (
          <div key={chat.id} className="flex items-center justify-between rounded-xl bg-black/30 p-4">
            <Link href={`/chat/${chat.id}`} className="flex items-center gap-4 truncate">
              <MessageSquareText className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => onDelete(chat.id)} className="text-red-500 hover:text-red-500/80">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

type ChatGroupProps = {
  title: string;
  chats: ChatSession[];
  onDelete: (chatId: string) => void;
};

// This component now receives the user object as a prop
function ChatHistoryClientPage({ user }: { user: User }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const chatsQuery = useMemoFirebase(
    () => query(collection(firestore, 'users', user.uid, 'chats'), orderBy('createdAt', 'desc')),
    [firestore, user]
  );
  
  const { data: chats, isLoading: areChatsLoading } = useCollection<ChatSession>(chatsQuery);

  const handleCreateNewChat = () => {
    const chatsCollectionRef = collection(firestore, 'users', user.uid, 'chats');
    startTransition(async () => {
      const newChatDoc = await addDoc(chatsCollectionRef, {
        title: 'New Chat',
        createdAt: serverTimestamp(),
      });
      router.push(`/chat/${newChatDoc.id}`);
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    const chatDocRef = doc(firestore, 'users', user.uid, 'chats', chatId);
    await deleteDoc(chatDocRef);
  };
  
  const now = new Date();
  const todayChats = chats?.filter(chat => isToday(new Date(chat.createdAt.seconds * 1000))) ?? [];
  const last7DaysChats = chats?.filter(chat => {
    const chatDate = new Date(chat.createdAt.seconds * 1000);
    return !isToday(chatDate) && isWithinInterval(chatDate, { start: subDays(now, 7), end: now });
  }) ?? [];
  const olderChats = chats?.filter(chat => {
    const chatDate = new Date(chat.createdAt.seconds * 1000);
    return !isToday(chatDate) && !isWithinInterval(chatDate, { start: subDays(now, 7), end: now });
  }) ?? [];

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-app-gradient-dark dark:bg-app-gradient-dark text-white">
        <header className="flex items-center justify-between p-4 flex-shrink-0">
          <h1 className="text-xl font-bold">ArisCBT</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">New Chats</h2>
            <Button 
              className="w-full h-14 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90"
              onClick={handleCreateNewChat}
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create New Chats'}
            </Button>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chats History</h2>
              <Link href="#" className="text-sm font-medium hover:underline">See More</Link>
            </div>
            {areChatsLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-6">
                {chats && chats.length > 0 ? (
                  <>
                    {todayChats.length > 0 && <ChatGroup title="Today" chats={todayChats} onDelete={handleDeleteChat} />}
                    {last7DaysChats.length > 0 && <ChatGroup title="Last 7 Days" chats={last7DaysChats} onDelete={handleDeleteChat} />}
                    {olderChats.length > 0 && <ChatGroup title="Older" chats={olderChats} onDelete={handleDeleteChat} />}
                  </>
                ) : (
                  <div className="text-center p-4 text-white/80">No chat history yet. Start a new conversation!</div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </AppShell>
  );
}

// This is the main component that handles loading and auth state.
export default function ChatHistoryPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) {
    return (
      <AppShell>
        <div className="flex h-dvh w-full items-center justify-center bg-app-gradient dark:bg-app-gradient-dark">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  // Once the user is loaded, render the client page with the user prop.
  return <ChatHistoryClientPage user={user} />;
}
