"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { session, isLoading } = useSupabase();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/auth");
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE] px-4">
        <p className="text-sm text-muted-foreground">Confirmando tu sesión...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
