"use client";

import { createContext, ReactNode } from "react";

interface MypageContextType {
  nickname: string;
  profileImage: string;
}

export const MypageContext = createContext<MypageContextType>({
  nickname: "",
  profileImage: "",
});

interface MypageProviderProps {
  children: ReactNode;
  nickname: string;
  profileImage: string;
}

export function MypageProvider({ children, nickname, profileImage }: MypageProviderProps) {
  return (
    <MypageContext.Provider value={{ nickname, profileImage }}>{children}</MypageContext.Provider>
  );
}
