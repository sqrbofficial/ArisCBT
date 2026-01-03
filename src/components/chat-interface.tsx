
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal, Menu } from "lucide-react";
import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { collection, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";

import { handleUserMessage } from "@/app/chat/actions";
import ChatMessage from "@/components/chat-message";
import CrisisDialog from "@/components/crisis-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { CrisisInfo, Message } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { useSidebar } from "./ui/sidebar";
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

const initialMessage: Message = {
  id: "0",
  role: "ai",
  text: "Hello. I'm here to provide a safe, non-judgmental space for you to explore your thoughts and feelings. What's on your mind today?",
  createdAt: Timestamp.now(),
};

export default function ChatInterface() {
  const { user } = useUser();
  const firestore = useFirestore();

  const messagesCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "messages") : null),
    [user, firestore]
  );

  const messagesQuery = useMemoFirebase(
    () => (messagesCollectionRef ? query(messagesCollectionRef, orderBy("createdAt", "asc")) : null),
    [messagesCollectionRef]
  );
  
  const { data: fetchedMessages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [crisisInfo, setCrisisInfo] = useState<CrisisInfo | null>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { setOpenMobile } = useSidebar();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const messages = useMemo(() => {
    const combined = [...(fetchedMessages || []), ...localMessages];
    if (combined.length === 0 && !isLoadingMessages) {
        return [initialMessage];
    }
    return combined;
  },[fetchedMessages, localMessages, isLoadingMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!messagesCollectionRef) return;

    const userMessage: Omit<Message, 'id' | 'createdAt'> = {
      role: "user",
      text: values.message,
    };
    
    const userMessageForState: Message = {
        ...userMessage,
        id: crypto.randomUUID(),
        createdAt: Timestamp.now(),
    }

    addDocumentNonBlocking(messagesCollectionRef, { ...userMessage, createdAt: serverTimestamp() });
    
    const typingMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      text: "...",
      isTyping: true,
      createdAt: Timestamp.now(),
    };

    setLocalMessages([userMessageForState, typingMessage]);
    form.reset();

    startTransition(async () => {
      const history = [...messages, userMessageForState];
      const result = await handleUserMessage(
        userMessageForState.text,
        history
      );

      if (result.type === "crisis") {
        setCrisisInfo(result.data);
        setLocalMessages([]); // Remove typing indicator and optimistic user message
      } else {
        const aiMessage: Omit<Message, 'id' | 'createdAt'> = {
          role: "ai",
          text: result.data.aiResponse,
        };
        addDocumentNonBlocking(messagesCollectionRef, { ...aiMessage, createdAt: serverTimestamp() });

        // Remove typing indicator, local user message is now persisted via onSnapshot
        setLocalMessages([]);
        
        // We can't easily add distortion info to the user's message as it's now in Firestore.
        // For simplicity, we will not update the user message with distortion info for now.
      }
    });
  };
  
  return (
    <div className="relative flex h-full max-h-dvh flex-col items-center bg-background">
      <header className="fixed top-0 z-10 flex w-full max-w-4xl items-center justify-between p-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpenMobile(true)}>
          <Menu />
        </Button>
      </header>

      <div className="flex-1 w-full max-w-4xl overflow-hidden pt-16 md:pt-4">
        <ScrollArea className="h-full">
          <div className="space-y-8 p-4">
             {isLoadingMessages && messages.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={msg.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <ChatMessage message={msg} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-full max-w-4xl p-4 pb-8">
        <Card className="rounded-2xl shadow-lg bg-card/80 dark:bg-sidebar-accent/50">
          <CardContent className="p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-0 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if(form.getValues("message")) {
                                form.handleSubmit(onSubmit)();
                              }
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isPending || !user} className="rounded-full">
                  <SendHorizonal />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {crisisInfo && (
        <CrisisDialog
          isOpen={!!crisisInfo}
          onClose={() => setCrisisInfo(null)}
          crisisInfo={crisisInfo}
        />
      )}
    </div>
  );
}
