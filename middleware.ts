import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          applyCookie(request, response, name, value, options);
        });
      },
    },
  });

  await supabase.auth.getSession();

  return response;
}

function applyCookie(
  request: NextRequest,
  response: NextResponse,
  name: string,
  value: string,
  options: CookieOptions
) {
  const cookieOptions = { ...(options ?? {}) } as CookieOptions & { name?: string };
  delete cookieOptions.name;

  if (value === "") {
    request.cookies.delete(name);
    response.cookies.delete({
      name,
      ...cookieOptions,
    });
    return;
  }

  request.cookies.set(name, value);
  response.cookies.set({
    name,
    value,
    ...cookieOptions,
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
