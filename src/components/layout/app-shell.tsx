"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookHeart, Bot, MessageSquareText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/",
    icon: MessageSquareText,
    label: "Chat",
  },
  {
    href: "/progress",
    icon: BarChart3,
    label: "Progress",
  },
  {
    href: "/resources",
    icon: BookHeart,
    label: "Resources",
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <main className="h-dvh">{children}</main>;
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="ghost" className="h-auto justify-start p-2" asChild>
            <Link href="/">
              <Bot className="text-primary" />
              <div className="flex flex-col items-start">
                <span className="font-headline text-lg font-bold">ArisCBT</span>
                <span className="text-xs text-muted-foreground">CBT Companion</span>
              </div>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn(
                    "justify-start",
                    pathname === item.href && "font-bold"
                  )}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-12 items-center gap-2 border-b bg-background/50 px-4 md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2 font-bold">
            <Bot size={24} className="text-primary"/>
            <span className="font-headline">ArisCBT</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
