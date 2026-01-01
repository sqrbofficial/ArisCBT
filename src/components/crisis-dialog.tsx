"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CrisisInfo } from "@/lib/types";

type CrisisDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  crisisInfo: CrisisInfo;
};

export default function CrisisDialog({
  isOpen,
  onClose,
  crisisInfo,
}: CrisisDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>It sounds like you're going through a lot right now.</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            If you are in crisis or may be in danger, please use the resources below to get immediate help.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
          {crisisInfo.crisisMessage}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
