import "server-only";
import { siteConfig } from "@/lib/config";

// IndexNow lets us push changed URLs to search engines (Bing, Yandex, Seznam,
// Naver — and Google is piloting it) the moment content is published or edited,
// instead of waiting for the next crawl. One POST notifies all participating
// engines via the shared api.indexnow.org endpoint.
//
// Verification: the key in INDEXNOW_KEY must also be served as a plain-text file
// at `${siteConfig.url}/<key>.txt` (see public/<key>.txt). keyLocation below
// tells the engines where to find it.

const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY = process.env.INDEXNOW_KEY;

/**
 * Push one or more URLs (absolute, or paths resolved against the site URL) to
 * IndexNow. Fully fail-safe: it never throws, so a failed ping can never break
 * the save that triggered it. No-ops when INDEXNOW_KEY is unset.
 */
export async function pingIndexNow(urls: readonly string[]): Promise<void> {
  if (!KEY) {
    console.warn("[indexnow] INDEXNOW_KEY not set — skipping ping");
    return;
  }

  const base = siteConfig.url;
  const urlList = [...new Set(urls)]
    .filter(Boolean)
    .map((u) => (u.startsWith("http") ? u : `${base}${u.startsWith("/") ? u : `/${u}`}`));

  if (urlList.length === 0) return;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: siteConfig.domain,
        key: KEY,
        keyLocation: `${base}/${KEY}.txt`,
        urlList,
      }),
      // Don't let a slow engine hang a server action.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[indexnow] ping failed: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    // Network error, timeout, missing fetch — log and move on. Never rethrow.
    console.error("[indexnow] ping error", error);
  }
}
