import React, { createContext, useContext, ReactNode } from "react";
import { useSocket } from "@/hooks/useSocket";

export interface SocketContextValue {
  isConnected: boolean;
  soundData: { label: string; confidence: number } | null;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
  sendAudioData: (audioData: ArrayBuffer) => void;
  clearSound: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocketContext(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return ctx;
}


