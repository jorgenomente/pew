import type { SupabaseClient, User } from "@supabase/supabase-js";

type ProfilePayload = {
  user_id: string;
  email: string | null;
};

export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
) {
  const payload: ProfilePayload = {
    user_id: user.id,
    email: user.email ?? null,
  };

  return supabase.from("profiles").upsert(payload, {
    onConflict: "user_id",
  });
}
