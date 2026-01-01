"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookHeart, Bot, LogOut, MessageSquareText, Settings, Siren, User as UserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push('/auth/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Signing Out",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  if (isUserLoading) {
    return (
        <div className="flex h-dvh w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
  }

  if (!user) {
    // If no user, show the children directly which should be the login/signup pages.
    return <>{children}</>;
  }
  
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

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
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.isAnonymous ? userAvatar?.imageUrl : user.photoURL || userAvatar?.imageUrl} alt="User" />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start truncate">
              <span className="text-sm font-semibold truncate">
                {user.isAnonymous ? 'Guest User' : user.email}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleSignOut}>
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
