import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import "./globals.css";
import { SupabaseProvider } from "@/components/supabase-provider";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ῥέω — Mindful Finance",
  description:
    "Panel financiero mindful para acompañarte en la gestión serena de tu economía.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = createServerSupabaseClient();
  let session: Session | null = null;

  try {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    session = currentSession ?? null;
  } catch (error) {
    console.warn("RootLayout: no se pudo obtener la sesión inicial.", error);
  }

  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground">
        <SupabaseProvider initialSession={session}>
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}
