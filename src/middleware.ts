// Auth a client to access and protected pages
export { authorise as middleware } from "@/core/auth/authorise";

export const config = {
  matcher: ["/dashboard/:path*"],
};
