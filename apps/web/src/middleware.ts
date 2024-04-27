import { updateSession } from "@/utils/supabase/middleware";
import { createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return await updateSession(req, async (res, supabase, user) => {
    function redirect(pathname: string, searchParams?: URLSearchParams) {
      const targetUrl = req.nextUrl.clone();
      targetUrl.pathname = pathname;
      if (searchParams) {
        // Override search parameters
        for (const key of targetUrl.searchParams.keys())
          targetUrl.searchParams.delete(key);
        searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
      }
      return NextResponse.redirect(targetUrl, {
        headers: res.headers,
      });
    }

    const path = req.nextUrl.pathname;

    if (user != null) {
      const hasProfile = user
        ? (
            await createServiceServer(cookies())
              .from("profile")
              .select("id", { count: "exact", head: true })
              .eq("id", user.id)
          ).count
        : false;
      if (!hasProfile && path !== "/signup" && path !== "/auth/callback") {
        // Redirect user to signup since they still need to complete their signup
        const searchParams = new URLSearchParams();
        let redirectUrl = req.nextUrl.pathname;
        if (req.nextUrl.searchParams.size)
          redirectUrl += `?${req.nextUrl.searchParams}`;
        searchParams.set("redirect", redirectUrl);
        return redirect(`/signup`, searchParams);
      } else if (hasProfile && (path === "/signup" || path == "/home"))
        // Redirect user to dashboard since they completed their signup
        return redirect("/dashboard");
    } else if (path.match(/^\/dashboard(\/.*)?$/)) {
      // Redirect guest to home page since they are not logged in
      return redirect("/home");
    }

    return res;
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/imageFill (imageFill optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/imageFill|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
