import { cookies, headers } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase server client is missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export function createServerSupabaseClient() {
  const cookieStorePromise = getCookieStore();

  return createServerClient(
    supabaseUrl ?? "",
    supabaseAnonKey ?? "",
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookieStorePromise;
          if (cookieStore?.get) {
            return cookieStore.get(name)?.value;
          }
          return readFromHeader(name);
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookieStorePromise;
          if (cookieStore?.set) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.warn("Failed to set auth cookie", error);
            }
          } else {
            console.warn("Supabase auth cookie: set is not available in this context.");
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookieStorePromise;
          if (cookieStore?.set) {
            try {
              cookieStore.set({ name, value: "", ...options, maxAge: 0 });
            } catch (error) {
              console.warn("Failed to remove auth cookie", error);
            }
          } else {
            console.warn("Supabase auth cookie: remove is not available in this context.");
          }
        },
      },
    }
  );
}

async function getCookieStore() {
  try {
    const maybeStore = cookies();
    const store = await maybeStore;
    const hasGet = typeof store.get === "function";
    const hasSet = typeof store.set === "function";

    if (!hasGet && !hasSet) {
      return null;
    }

    return store as {
      get?: (name: string) => { value: string } | undefined;
      set?: (options: { name: string; value: string; maxAge?: number } & CookieOptions) => void;
    };
  } catch {
    return null;
  }
}

async function readFromHeader(name: string) {
  try {
    const headerList = await headers();
    if (!headerList || typeof headerList.get !== "function") {
      return undefined;
    }

    const header = headerList.get("cookie");
    if (!header) {
      return undefined;
    }

    const cookiesArray = header.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookiesArray) {
      if (!cookie) continue;
      const index = cookie.indexOf("=");
      const cookieName = index > -1 ? cookie.slice(0, index) : cookie;
      if (cookieName === decodeURIComponent(name)) {
        const cookieValue = index > -1 ? cookie.slice(index + 1) : "";
        return decodeURIComponent(cookieValue);
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}
