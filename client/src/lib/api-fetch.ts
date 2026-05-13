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

function getApiUrl(path: string | RequestInfo | URL): string {
  const pathStr = typeof path === "string" ? path : path instanceof URL ? path.href : (path as any).url;
  
  if (isApiPath(pathStr)) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const apiPath = typeof pathStr === "string" ? pathStr : pathStr.toString();
    
    // If it's a relative path and we have a backend URL, make it absolute
    if (backendUrl && (apiPath.startsWith("/api") || apiPath.startsWith("api/"))) {
      return `${backendUrl}${apiPath}`;
    }
  }
  
  return typeof pathStr === "string" ? pathStr : pathStr.toString();
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const authUser = getCurrentAuthUser();
  const resolvedUserId = authUser?.userId || authUser?.id;

  if (isApiPath(input) && resolvedUserId && !headers.has("X-User-Id")) {
    headers.set("X-User-Id", resolvedUserId);
  }

  const url = getApiUrl(input);

  return fetch(url, {
    credentials: init.credentials || "include",
    ...init,
    headers,
  });
}
