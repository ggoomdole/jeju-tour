"use client";

import { queryClient } from "@/lib/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "../ui/sonner";

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" duration={3000} closeButton />
    </QueryClientProvider>
  );
}
