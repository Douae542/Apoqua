import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("gfst_token")?.value
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}