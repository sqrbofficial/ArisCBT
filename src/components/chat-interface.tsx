
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal, Mic, Square } from "lucide-react";
import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { collection, query, orderBy, serverTimestamp, Timestamp, doc, updateDoc } from "firebase/firestore";

import { handleUserMessage, handleTextToSpeech } from "@/app/chat/actions";
import ChatMessage from "@/components/chat-message";
import CrisisDialog from "@/components/crisis-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { CrisisInfo, Message } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

type PlainMessage = {
    id: string;
    role: "user" | "ai";
    text: string;
    createdAt: string; // ISO string
};

interface ChatInterfaceProps {
    chatId: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const messagesQuery = useMemoFirebase(
    () => {
      // This query now depends on user and chatId, but will only be executed by the hook when enabled.
      // A dummy path is used if data is missing to prevent crashes.
      const path = user ? `users/${user.uid}/chats/${chatId}/messages` : 'dummy_path';
      return query(collection(firestore, path), orderBy("createdAt", "asc"));
    },
    [user, firestore, chatId]
  );
  
  // The hook is now controlled by the `enabled` flag.
  const { data: fetchedMessages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery, { enabled: !!user && !!chatId });
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [crisisInfo, setCrisisInfo] = useState<CrisisInfo | null>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        form.setValue('message', transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [form]);


  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };
  
  const playAudio = async (text: string, messageId: string) => {
    if (currentlyPlaying === messageId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
      return;
    }

    setCurrentlyPlaying(messageId);
    const { audioUrl } = await handleTextToSpeech(text);
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    } else {
      setCurrentlyPlaying(null);
    }
  };


  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const messages = useMemo(() => {
    const combined = [...(fetchedMessages || []), ...localMessages];
     if (combined.length === 0 && !isLoadingMessages) {
      return [{
        id: "0",
        role: "ai",
        text: "Hello. I'm here to provide a safe, non-judgmental space for you to explore your thoughts and feelings. What's on your mind today?",
        createdAt: Timestamp.now(),
      }];
    }
    return combined;
  },[fetchedMessages, localMessages, isLoadingMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    const messagesCollectionRef = collection(firestore, "users", user.uid, "chats", chatId, "messages");


    const userMessage: Omit<Message, 'id' | 'createdAt'> = {
      role: "user",
      text: values.message,
    };
    
    addDocumentNonBlocking(messagesCollectionRef, { ...userMessage, createdAt: serverTimestamp() });

    // If this is the first user message, update the chat session title
    if (fetchedMessages?.length === 0) {
        const chatDocRef = doc(firestore, 'users', user.uid, 'chats', chatId);
        updateDoc(chatDocRef, { title: values.message });
    }
    
    const typingMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      text: "...",
      isTyping: true,
      createdAt: Timestamp.now(),
    };

    setLocalMessages([typingMessage]);
    form.reset();

    startTransition(async () => {
      const currentHistory = fetchedMessages || [];
      const historyForAI = [...currentHistory, { ...userMessage, id: 'temp-user', createdAt: Timestamp.now() }];
      
      const plainHistory: PlainMessage[] = historyForAI.map(m => ({
        id: m.id,
        role: m.role,
        text: m.text,
        createdAt: m.createdAt.toDate().toISOString(),
      }));

      const result = await handleUserMessage(
        userMessage.text,
        plainHistory
      );

      if (result.type === "crisis") {
        setCrisisInfo(result.data);
        setLocalMessages([]);
      } else {
        const aiMessage: Omit<Message, 'id' | 'createdAt'> = {
          role: "ai",
          text: result.data.aiResponse,
        };
        addDocumentNonBlocking(messagesCollectionRef, { ...aiMessage, createdAt: serverTimestamp() });

        setLocalMessages([]);
      }
    });
  };
  
  return (
    <div className="relative flex-1 flex h-full max-h-dvh flex-col items-center overflow-hidden">
      <div className="flex-1 w-full max-w-4xl overflow-hidden pt-4 md:pt-4">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
             {isLoadingMessages && messages.length <= 1 && (
              <div className="flex justify-center items-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={msg.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <ChatMessage 
                  message={msg}
                  onPlayAudio={playAudio}
                  isAudioPlaying={currentlyPlaying === msg.id}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-full max-w-4xl p-4 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <div className="relative flex-1">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="write your question to ai chatbot here"
                          className="min-h-0 resize-none rounded-full border-none bg-black/30 pl-12 pr-6 py-3 text-white placeholder:text-white/50"
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
                <Button type="button" size="icon" variant="ghost" onClick={toggleRecording} disabled={!recognitionRef.current || isPending} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                  {isRecording ? <Square /> : <Mic />}
                  <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                </Button>
            </div>
            <Button type="submit" size="icon" disabled={isPending || !user} className="rounded-full h-12 w-12 flex-shrink-0">
              <SendHorizonal />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
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
