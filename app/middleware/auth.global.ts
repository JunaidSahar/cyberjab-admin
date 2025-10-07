import { useUserStore } from "@/stores/userStore";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side rendering to avoid store initialization issues
  if (import.meta.server) return;

  let userStore;
  let authComposable;

  try {
    userStore = useUserStore();
    authComposable = useAuth();
  } catch (error) {
    console.warn("Auth middleware: Stores not ready yet, skipping...");
    return;
  }

  const { getUser, refreshAccessToken, initializeAuth } = authComposable;

  // Initialize auth state from cookies
  initializeAuth();

  // Cookies
  const accessTokenCookie = useCookie("access_token");
  const refreshTokenCookie = useCookie("refresh_token");

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const authPages = ["/login", "/register"];

  // Check if current route needs authentication (safe match for query params)
  const requiresAuth = !publicRoutes.some((route) => to.path.startsWith(route));

  // Tokens
  const hasAccessToken = !!accessTokenCookie.value;
  const hasRefreshToken = !!refreshTokenCookie.value;

  // Sync token state if cookie exists but store not set
  if (hasAccessToken && !userStore.isAuthenticated) {
    userStore.token = accessTokenCookie.value;
    userStore.isAuthenticated = true;
  }

  // Try to refresh token if needed
  if (!hasAccessToken && hasRefreshToken && requiresAuth) {
    const { data: newAccessToken, error } = await refreshAccessToken();
    if (error) {
      console.error("Failed to refresh token:", error);
      userStore.clearAuth();
      if (!to.path.startsWith("/login")) {
        return navigateTo("/login?message=access_required");
      }
    }
  }

  // Fetch user if authenticated but user data not loaded
  if (userStore.isAuthenticated && hasAccessToken && !userStore.user) {
    const { data, error } = await getUser();

    if (data) {
      userStore.setUser(data);
    } else if (error) {
      console.error("Failed to fetch user data:", error);

      // Try refresh token once before logging out
      if (hasRefreshToken) {
        const { data: newAccessToken, error: refreshError } = await refreshAccessToken();
        if (!refreshError) {
          const { data: retryData, error: retryError } = await getUser();
          if (retryData) {
            userStore.setUser(retryData);
          } else {
            userStore.clearAuth();
            if (!to.path.startsWith("/login")) {
              return navigateTo("/login?message=access_required");
            }
          }
        } else {
          userStore.clearAuth();
          if (!to.path.startsWith("/login")) {
            return navigateTo("/login?message=access_required");
          }
        }
      } else {
        userStore.clearAuth();
        if (!to.path.startsWith("/login")) {
          return navigateTo("/login");
        }
      }
    }
  }

  // Prevent infinite redirect loop (login <-> protected page)
  if (to.path.startsWith("/login") && !userStore.isAuthenticated) {
    return; // stop further redirect check
  }

  // Redirect unauthenticated users trying to access protected routes
  if (requiresAuth && !userStore.isAuthenticated) {
    console.log("Protected route accessed without auth, redirecting to login");
    return navigateTo("/login?message=access_required");
  }

  // Prevent authenticated users from accessing login/register
  if (userStore.isAuthenticated && authPages.some((page) => to.path.startsWith(page))) {
    console.log("Auth page accessed while logged in, redirecting to dashboard");
    return navigateTo("/");
  }
});
