"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Bot, Sparkles, User } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === "ai";
  const arisAvatar = PlaceHolderImages.find((img) => img.id === "aris-avatar");
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        !isAi && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={isAi ? arisAvatar?.imageUrl : userAvatar?.imageUrl}
          alt={isAi ? "Dr. Aris" : "User"}
        />
        <AvatarFallback>
          {isAi ? <Bot /> : <User />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-md rounded-xl px-4 py-3",
          isAi
            ? "rounded-bl-none bg-card"
            : "rounded-br-none bg-primary text-primary-foreground"
        )}
      >
        {message.isTyping ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50"></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
        )}
      </div>

      {!isAi && message.distortion?.hasDistortion && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mt-1 self-center text-muted-foreground hover:text-accent-foreground">
                <Sparkles className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="font-bold">
                Thought Pattern: {message.distortion.identifiedDistortion}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {message.distortion.suggestedChallenge}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
