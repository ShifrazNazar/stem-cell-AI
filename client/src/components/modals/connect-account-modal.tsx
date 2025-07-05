"use client";

import { useModalStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

function googleSignIn(): Promise<void> {
  return new Promise((resolve) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    resolve();
  });
}

export function ConnectAccountModal() {
  const modalKey = "connectAccountModal";
  const { isOpen, closeModal } = useModalStore();

  const mutation = useMutation({
    mutationFn: googleSignIn,
    onSuccess: () => {
      closeModal(modalKey);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleGoogleSignIn = async () => {
    mutation.mutate();
  };

  return (
    <Dialog
      open={isOpen(modalKey)}
      onOpenChange={() => closeModal(modalKey)}
      key={modalKey}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Google Account</DialogTitle>
          <DialogDescription>
            Please connect your Google account to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <>Sign in with Google</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
