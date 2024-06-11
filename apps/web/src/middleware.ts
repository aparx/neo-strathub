import { updateSession } from "@/utils/supabase/middleware";
import { createServiceServer } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { TeamMemberFlags, hasFlag } from "./modules/auth/flags";

function redirect({
  pathname,
  request,
  response,
  searchParams,
}: {
  pathname: string;
  request: NextRequest;
  response: NextResponse;
  searchParams?: URLSearchParams;
}) {
  const targetUrl = request.nextUrl.clone();
  targetUrl.pathname = pathname;
  if (searchParams) {
    // Override search parameters
    for (const key of targetUrl.searchParams.keys())
      targetUrl.searchParams.delete(key);
    searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
  }
  return NextResponse.redirect(targetUrl, {
    headers: response.headers,
  });
}

export async function middleware(req: NextRequest) {
  return await updateSession(req, async (res, supabase, user) => {
    const path = req.nextUrl.pathname;

    // Handle redirects to `/home` if trying to access dashboard
    if (user == null && path.match(/^\/dashboard(\/.*)?$/))
      return redirect({ pathname: "/home", request: req, response: res });

    // Handle auth based redirects (such as signup, or dashboard, etc.)
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
        return redirect({
          pathname: "/signup",
          searchParams,
          request: req,
          response: res,
        });
      } else if (hasProfile && (path === "/signup" || path == "/home")) {
        // Redirect user to dashboard since they completed their signup
        return redirect({
          pathname: "/dashboard",
          request: req,
          response: res,
        });
      }
    }

    // Handle editor URL pathnames and redirects
    const match = req.nextUrl.pathname.match(
      /^\/editor\/(?<uuid>.[^\/]+)(?<leaf>\/.*)?$/,
    );
    if (match && match.groups?.uuid)
      return handleEditorPaths({
        user,
        request: req,
        response: res,
        uuid: match.groups.uuid,
        leaf: match.groups.leaf,
      });

    return res;
  });
}

async function handleEditorPaths({
  user,
  request,
  response,
  uuid,
  leaf,
}: {
  user: User | null;
  request: NextRequest;
  response: NextResponse;
  uuid: string;
  leaf?: string;
}) {
  if (!user) return redirect({ pathname: "/signup", request, response });

  const server = createServiceServer(cookies());
  const { data: flags } = await server.rpc("get_perms_on_blueprint", {
    blueprint_id: uuid,
    user_id: user.id,
  });

  if (flags == null)
    // TODO request access page OR at least some error page
    return redirect({ pathname: "/dashboard", request, response });

  const canModify = hasFlag(flags, TeamMemberFlags.MODIFY_DOCUMENTS);

  if ((leaf === "/edit" || leaf == null) && !canModify)
    return redirect({ pathname: `/editor/${uuid}/preview`, request, response });

  if (leaf == null && canModify)
    return redirect({ pathname: `/editor/${uuid}/edit`, request, response });

  return response;
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
