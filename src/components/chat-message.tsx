"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Bot, Speaker, User, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";

type ChatMessageProps = {
  message: Message;
  onPlayAudio: (text: string, messageId: string) => void;
  isAudioPlaying: boolean;
};

export default function ChatMessage({ message, onPlayAudio, isAudioPlaying }: ChatMessageProps) {
  const isAi = message.role === "ai";
  const arisAvatar = PlaceHolderImages.find((img) => img.id === "aris-avatar");
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <div
      className={cn(
        "flex items-start gap-4"
      )}
    >
      <Avatar className="h-8 w-8 border">
        <AvatarImage
          src={isAi ? arisAvatar?.imageUrl : userAvatar?.imageUrl}
          alt={isAi ? "ArisCBT" : "User"}
        />
        <AvatarFallback>
          {isAi ? <Bot /> : <User />}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <div className="font-bold">{isAi ? "ArisCBT" : "You"}</div>
        <div className="prose prose-stone dark:prose-invert max-w-none text-foreground">
          {message.isTyping ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          )}
        </div>
        {isAi && !message.isTyping && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onPlayAudio(message.text, message.id)}>
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
    </div>
  );
}
