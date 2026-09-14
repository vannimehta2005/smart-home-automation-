// Recovers from stale asset chunks after a new deploy: an open tab still holds
// the old chunk names, so a lazily-loaded route 404s. Reload once to pick up
// the fresh build; the sessionStorage guard prevents reload loops.
const GUARD_KEY = "__chunk_reload_attempt";

function isChunkLoadError(value: unknown): boolean {
  const message =
    value instanceof Error ? value.message : typeof value === "string" ? value : "";
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
  );
}

function reloadOnce() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(GUARD_KEY)) return;
  sessionStorage.setItem(GUARD_KEY, "1");
  window.location.reload();
}

export function installChunkReload() {
  if (typeof window === "undefined") return;

  // Clear the guard only after the page has stayed healthy for a while, so a
  // reload that immediately fails again cannot start a reload loop.
  const guardTimer = window.setTimeout(() => sessionStorage.removeItem(GUARD_KEY), 10000);

  const onRejection = (event: PromiseRejectionEvent) => {
    if (isChunkLoadError(event.reason)) reloadOnce();
  };
  const onError = (event: ErrorEvent) => {
    if (isChunkLoadError(event.error ?? event.message)) reloadOnce();
  };
  const onPreloadError = () => reloadOnce();

  window.addEventListener("unhandledrejection", onRejection);
  window.addEventListener("error", onError);
  window.addEventListener("vite:preloadError", onPreloadError);

  return () => {
    window.clearTimeout(guardTimer);
    window.removeEventListener("unhandledrejection", onRejection);
    window.removeEventListener("error", onError);
    window.removeEventListener("vite:preloadError", onPreloadError);
  };
}
