import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("profiles").select("user_id").limit(1);
  return NextResponse.json({ ok: !error, rows: data?.length ?? 0, error: error?.message });
}
