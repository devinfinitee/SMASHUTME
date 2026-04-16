import { getCurrentAuthUser } from "@/lib/local-auth";

function isApiPath(input: RequestInfo | URL): boolean {
  if (typeof input === "string") {
    return input.startsWith("/api") || input.startsWith("api/");
  }

  if (input instanceof URL) {
    return input.pathname.startsWith("/api");
  }

  return input.url.startsWith("/api") || input.url.includes("/api/");
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const authUser = getCurrentAuthUser();
  const resolvedUserId = authUser?.userId || authUser?.id;

  if (isApiPath(input) && resolvedUserId && !headers.has("X-User-Id")) {
    headers.set("X-User-Id", resolvedUserId);
  }

  return fetch(input, {
    credentials: init.credentials || "include",
    ...init,
    headers,
  });
}
