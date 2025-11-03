import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: async (n)=>(await cookies()).get(n)?.value, set(){}, remove(){} } }
  );
  const { data, error } = await supabase.from("profiles").select("user_id").limit(1);
  return NextResponse.json({ ok: !error, rows: data?.length ?? 0, error: error?.message });
}