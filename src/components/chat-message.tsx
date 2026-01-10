'use client';

import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Speaker, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type ChatMessageProps = {
  message: Message;
  onPlayAudio: (text: string, messageId: string) => void;
  isAudioPlaying: boolean;
};

export default function ChatMessage({ message, onPlayAudio, isAudioPlaying }: ChatMessageProps) {
  const isAi = message.role === "ai";

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        !isAi && "flex-row-reverse"
      )}
    >
      <div className={cn(
          "max-w-[75%] rounded-2xl p-4 text-white",
          isAi ? "bg-primary" : "bg-black/40"
      )}>
        <div className="prose prose-stone dark:prose-invert max-w-none text-white">
          {message.isTyping ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white/70 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white/70 [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white/70"></span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          )}
        </div>
      </div>
       {isAi && !message.isTyping && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white" onClick={() => onPlayAudio(message.text, message.id)}>
                    {isAudioPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAudioPlaying ? 'Stop audio' : 'Listen to message'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
    </div>
  );
}
