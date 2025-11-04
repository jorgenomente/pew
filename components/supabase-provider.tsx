"use client";
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface SupabaseContextValue {
  supabase: SupabaseClient;
  session: Session | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

interface SupabaseProviderProps {
  initialSession: Session | null;
  children: ReactNode;
}

export function SupabaseProvider({ initialSession, children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState(() => initialSession === null);

  useEffect(() => {
    let active = true;

    const resolveSession = async () => {
      const {
        data: { session: current },
        error,
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!error) {
        setSession(current);
      } else {
        console.warn("SupabaseProvider: no se pudo obtener la sesión inicial.", error);
      }

      setIsLoading(false);
    };

    if (initialSession === null) {
      resolveSession();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [initialSession, supabase]);

  const value = useMemo(
    () => ({
      supabase,
      session,
      isLoading,
    }),
    [supabase, session, isLoading],
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
}
