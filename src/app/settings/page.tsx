"use client"

import { useTheme } from "next-themes"
import { useAuth, useFirestore, useUser } from "@/firebase";
import { collection, writeBatch, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AppShell from "@/components/layout/app-shell";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    if (!user) return;
    setIsClearing(true);
    try {
      const messagesRef = collection(firestore, 'users', user.uid, 'messages');
      const querySnapshot = await getDocs(messagesRef);
      const batch = writeBatch(firestore);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast({
        title: "Chat History Cleared",
        description: "Your conversation history has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
      });
    } finally {
      setIsClearing(false);
    }
  };


  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-2xl font-bold">Settings</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose how you would like the app to look.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid gap-4 md:grid-cols-3"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Light
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr  -only" />
                <Label
                  htmlFor="dark"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Dark
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  System
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your personal data and chat history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clearing your chat history will permanently delete all messages
              from your conversations. This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isClearing}>
                  <Trash className="mr-2 h-4 w-4" />
                  {isClearing ? 'Clearing...' : 'Clear Chat History'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    chat history and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  )
}
