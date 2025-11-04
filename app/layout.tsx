import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SupabaseProvider } from "@/components/supabase-provider";
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
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground">
        <SupabaseProvider initialSession={null}>
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}
