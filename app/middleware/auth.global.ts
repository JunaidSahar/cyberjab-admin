import { useUserStore } from "@/stores/userStore";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side rendering to avoid store initialization issues
  if (import.meta.server) {
    return;
  }

  let userStore;
  let authComposable;
  
  try {
    userStore = useUserStore();
    authComposable = useAuth();
  } catch (error) {
    // If stores aren't ready yet, skip middleware
    console.warn('Auth middleware: Stores not ready yet, skipping...');
    return;
  }

  const { getUser, refreshAccessToken, initializeAuth } = authComposable;

  // Initialize auth state from cookies
  initializeAuth();

  // Get access token from cookie
  const accessTokenCookie = useCookie('access_token');
  const refreshTokenCookie = useCookie('refresh_token');

  // Define public routes that don't require authentication
  const publicRoutes = ['/login'];

  // Check if current route needs authentication (all routes except public ones)
  const requiresAuth = !publicRoutes.includes(to.path);

  // Check if we have any authentication tokens
  const hasAccessToken = !!accessTokenCookie.value;
  const hasRefreshToken = !!refreshTokenCookie.value;

  // If we have tokens but user store isn't authenticated, sync the state
  if (hasAccessToken && !userStore.isAuthenticated && accessTokenCookie.value) {
    userStore.token = accessTokenCookie.value;
    userStore.isAuthenticated = true;
  }

  // Try to refresh token if we have refresh token but no access token
  if (!hasAccessToken && hasRefreshToken && requiresAuth) {
    const { data: newAccessToken, error } = await refreshAccessToken();
    if (error) {
      console.error('Failed to refresh token:', error);
      userStore.clearAuth();
      return navigateTo('/login?message=access_required');
    }
  }

  // If user is authenticated but user data is not loaded, fetch it
  if (userStore.isAuthenticated && hasAccessToken && !userStore.user) {
    const { data, error } = await getUser();

    if (data) {
      console.log('User data fetched successfully:', data);
      userStore.setUser(data);
    } else if (error) {
      console.error('Failed to fetch user data:', error);
      // Try to refresh token once before giving up
      if (hasRefreshToken) {
        const { data: newAccessToken, error: refreshError } = await refreshAccessToken();
        if (!refreshError) {
          // Retry getting user data with new token
          const { data: retryData, error: retryError } = await getUser();
          if (retryData) {
            userStore.setUser(retryData);
          } else {
            userStore.clearAuth();
            return navigateTo('/login?message=access_required');
          }
        } else {
          userStore.clearAuth();
          return navigateTo('/login?message=access_required');
        }
      } else {
        userStore.clearAuth();
        return navigateTo('/login');
      }
    }
  }

  // Redirect to login if accessing protected route while not authenticated
  if (requiresAuth && !userStore.isAuthenticated) {
    console.log('Protected route accessed without auth, redirecting to login');
    return navigateTo('/login?message=access_required');
  }

  // Prevent authenticated users from accessing auth pages
  const authPages = ['/login', '/register'];
  if (userStore.isAuthenticated && authPages.includes(to.path)) {
    console.log('Auth page accessed while logged in, redirecting to dashboard');
    return navigateTo('/');
  }
});