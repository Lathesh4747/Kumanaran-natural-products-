import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about(.*)',
  '/blog(.*)',
  '/contact(.*)',
  '/faq(.*)',
  '/price(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pending-approval(.*)',
  '/api/contact(.*)',
  '/api/cron(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|mov|m4v|ogv|mp3|wav|ogg)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};
