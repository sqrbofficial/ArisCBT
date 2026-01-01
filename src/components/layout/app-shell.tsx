"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookHeart, Bot, MessageSquareText, Menu, Settings, Siren } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
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
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

const crisisItem = {
    href: "/crisis",
    icon: Siren,
    label: "Crisis",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === crisisItem.href}
                  className={cn(
                    "justify-start text-destructive hover:bg-destructive/10 hover:text-destructive font-bold",
                    pathname === crisisItem.href && "bg-destructive/20"
                  )}
                  tooltip={crisisItem.label}
                >
                  <Link href={crisisItem.href}>
                    <crisisItem.icon />
                    <span>{crisisItem.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppShellHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppShellHeader() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  
  if (pathname === "/") {
    // No header on the main chat page for a cleaner look
    return null;
  }
  const allItems = [...menuItems, crisisItem];
  const currentItem = allItems.find(item => item.href === pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setOpenMobile(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="flex items-center gap-2 font-bold">
        {currentItem && (
          <>
            <currentItem.icon className={cn("h-5 w-5", currentItem.href === "/crisis" ? "text-destructive" : "text-primary")}/>
            <span className="font-headline">{currentItem.label}</span>
          </>
        )}
      </div>
    </header>
  );
}
