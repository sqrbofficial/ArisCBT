'use client';

import {
  MessageSquareText,
  MoreVertical,
  Trash2,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';
import AppShell from '@/components/layout/app-shell';

type ChatSession = {
  id: string;
  title: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function ChatHistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  const chatsCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'chats') : null),
    [user, firestore]
  );

  const chatsQuery = useMemoFirebase(
    () => (chatsCollectionRef ? query(chatsCollectionRef, orderBy('createdAt', 'desc')) : null),
    [chatsCollectionRef]
  );
  
  const { data: chats, isLoading } = useCollection<ChatSession>(chatsQuery);

  const handleCreateNewChat = () => {
    startTransition(async () => {
        if (!chatsCollectionRef) return;
        const newChatDoc = await addDoc(chatsCollectionRef, {
            title: 'New Chat',
            createdAt: serverTimestamp(),
        });
        router.push(`/chat/${newChatDoc.id}`);
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;
    // Note: This deletes the chat session document, but not the subcollection of messages.
    // A cloud function would be needed for full cleanup.
    await deleteDoc(doc(firestore, 'users', user.uid, 'chats', chatId));
  };
  
  if (isUserLoading || !user) {
    return (
        <div className="flex h-dvh w-full items-center justify-center bg-background">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
  }
  
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
    <div className="flex h-full flex-col bg-gradient-to-b from-[#2A2A72] via-[#A83279] to-[#F85F00] text-white">
        <header className="flex items-center justify-between p-4">
            {/* Placeholder for sidebar trigger if we re-integrate AppShell */}
            <div></div> 
            <h1 className="text-xl font-bold">ArisCBT</h1>
            <Button variant="ghost" size="icon">
                <MoreVertical />
            </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">New Chats</h2>
                <Button 
                    className="w-full h-14 rounded-xl bg-[#A54A41] text-lg font-semibold text-white hover:bg-[#A54A41]/90"
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

                {isLoading ? (
                    <div className="text-center p-4">Loading chats...</div>
                ) : (
                    <div className="space-y-6">
                        {todayChats.length > 0 && <ChatGroup title="Today" chats={todayChats} onDelete={handleDeleteChat} />}
                        {last7DaysChats.length > 0 && <ChatGroup title="7 Days" chats={last7DaysChats} onDelete={handleDeleteChat} />}
                        {olderChats.length > 0 && <ChatGroup title="30 Days" chats={olderChats} onDelete={handleDeleteChat} />}
                    </div>
                )}
            </section>
        </main>
    </div>
  );
}


type ChatGroupProps = {
    title: string;
    chats: ChatSession[];
    onDelete: (chatId: string) => void;
}

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
                        <Button variant="ghost" size="icon" onClick={() => onDelete(chat.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
