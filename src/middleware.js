import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { RouteAccessMap } from "./app/vars/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(RouteAccessMap).map(route => ({
  matcher: createRouteMatcher(route),
  allowedRoles: RouteAccessMap[route]
}))

export default clerkMiddleware((auth, req) => {
  // if(isProtectedRoute(req)) auth().protect()
  const { sessionClaims } = auth()
  const role = sessionClaims?.metadata?.role
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(`http://localhost:3000/${role}`)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
