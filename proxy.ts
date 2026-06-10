import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // But EXCLUDE admin and api routes from next-intl handling
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
