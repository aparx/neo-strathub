"use client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export interface UserContext {
  user?: User | null;
}

const userContext = createContext<UserContext | null>(null);

export function UserContextProvider({
  user,
  children,
}: UserContext & {
  children: React.ReactNode;
}) {
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
}

export function useUserContext(): UserContext {
  const ctx = useContext(userContext);
  if (!ctx) throw new Error("Missing UserContextProvider");
  return ctx;
}
