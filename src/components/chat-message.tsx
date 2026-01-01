"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Bot, Sparkles, User } from "lucide-react";
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
        {/* Distortion logic is removed for now as it's harder to implement with Firestore persistence */}
      </div>
    </div>
  );
}
