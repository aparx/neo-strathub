import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return await updateSession(req, (res, supabase, user) => {
    function redirect(pathname: string) {
      const targetUrl = req.nextUrl.clone();
      targetUrl.pathname = pathname;
      return NextResponse.redirect(targetUrl, {
        headers: res.headers,
      });
    }

    // Redirect auth to dashboard if logged in
    if (user != null && req.nextUrl.pathname === "/")
      return redirect("/dashboard");

    // Redirect guest to home page if not logged in
    if (user == null && req.nextUrl.pathname.match(/^\/dashboard(\/.*)?$/))
      return redirect("/");

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
