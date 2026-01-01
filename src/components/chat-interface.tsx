"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal, Bot } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { handleUserMessage } from "@/app/chat/actions";
import ChatMessage from "@/components/chat-message";
import CrisisDialog from "@/components/crisis-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { CrisisInfo, Message } from "@/lib/types";
import { Card, CardContent } from "./ui/card";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

const initialMessages: Message[] = [
  {
    id: "0",
    role: "ai",
    text: "Hello, I'm Dr. Aris. I'm here to provide a safe space for you to explore your thoughts and feelings. What's on your mind today?",
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [crisisInfo, setCrisisInfo] = useState<CrisisInfo | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: values.message,
    };

    const typingMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      text: "...",
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMessage, typingMessage]);
    form.reset();

    startTransition(async () => {
      const result = await handleUserMessage(
        userMessage.text,
        [...messages, userMessage]
      );

      if (result.type === "crisis") {
        setCrisisInfo(result.data);
        setMessages((prev) => prev.slice(0, -2)); // Remove user and typing message
      } else {
        const aiMessage: Message = {
          id: typingMessage.id,
          role: "ai",
          text: result.data.aiResponse,
        };
        // Add distortion info to user's message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, distortion: result.data.distortion }
              : msg.id === typingMessage.id
              ? aiMessage
              : msg
          )
        );
      }
    });
  };
  
  return (
    <div className="flex h-full max-h-[calc(100vh-2rem)] flex-col">
      <div className="hidden items-center gap-4 p-4 md:flex">
        <Bot size={32} className="text-primary" />
        <div>
          <h1 className="font-headline text-2xl font-bold">Chat with Dr. Aris</h1>
          <p className="text-muted-foreground">This is a safe space to explore your thoughts.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 p-4">
            {messages.map((msg, index) => (
              <div key={msg.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <ChatMessage message={msg} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4">
        <Card className="rounded-xl">
          <CardContent className="p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-0 resize-none border-0 shadow-none focus-visible:ring-0"
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
                <Button type="submit" size="icon" disabled={isPending}>
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
