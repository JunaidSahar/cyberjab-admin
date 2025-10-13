import { useUserStore } from "@/stores/userStore";

export const useAuth = () => {
  const userStore = useUserStore();
  const config = useRuntimeConfig();

  // Cookie management
  const accessTokenCookie = useCookie("access_token", {
    default: () => '',
    httpOnly: false,
    secure: false, // Set to true in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const refreshTokenCookie = useCookie("refresh_token", {
    default: () => null,
    httpOnly: false,
    secure: false, // Set to true in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });


  const login = async (token: string) => {
    try {
      // Set the token in cookie and store
      accessTokenCookie.value = token;
      userStore.$patch({
        isAuthenticated: true,
        token: token,
      });
      return { data: "Token set successfully", error: null };
    } catch (error: any) {
      return { error: error.message || "Failed to set authentication token", data: null };
    }
  };

const getUser = async () => {
  // Get token from cookie or store
  const token = accessTokenCookie.value || userStore.token;

  if (!token) {
    return { error: "No access token available", data: null };
  }

  try {
    const res = await $fetch(`${config.public.API_BASE_URL}api/users/get-user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    return { data: res, error: null };
  } catch (error: any) {
    return { error: error?.data?.error || "An error occurred", data: null };
  }
};

const logout = async () => {
  try {
    // Clear cookies
    accessTokenCookie.value = '';
    refreshTokenCookie.value = null;

    // Clear user store
    userStore.clearAuth();

    // Optionally call backend logout endpoint
    const token = userStore.token;
    if (token) {
      try {
        await $fetch(`${config.public.API_BASE_URL}api/users/token/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: {
            refresh_token: refreshTokenCookie.value,
          },
          credentials: "include",
        });
      } catch (error) {
        // Ignore errors on logout
      }
    }

    return { data: "Logged out successfully", error: null };
  } catch (err) {
    return { error: err, data: null };
  }
};

const refreshAccessToken = async () => {
  const refreshToken = refreshTokenCookie.value;

  if (!refreshToken) {
    return { error: "No refresh token available", data: null };
  }

  try {
    const res: any = await $fetch(
      `${config.public.API_BASE_URL}api/users/token/refresh/`,
      {
        method: "POST",
        body: {
          refresh: refreshToken,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.access) {
      // Update access token in cookie and store
      accessTokenCookie.value = res.access;
      userStore.$patch({
        token: res.access,
        isAuthenticated: true,
      });

      return { data: res.access, error: null };
    }

    return { error: "Failed to refresh token", data: null };
  } catch (error: any) {
    // If refresh fails, clear all auth data
    accessTokenCookie.value = '';
    refreshTokenCookie.value = null;
    userStore.clearAuth();

    return { error: error?.data?.error || "Token refresh failed", data: null };
  }
};

// Initialize auth state from cookies
const initializeAuth = () => {
  const token = accessTokenCookie.value;
  if (token) {
    userStore.$patch({
      token,
      isAuthenticated: true,
    });
  }
};

const updateProfile = async (userData: any) => {
  // Get token from cookie or store
  const token = accessTokenCookie.value || userStore.token;

  if (!token) {
    return { error: "No access token available", data: null };
  }

  try {
    const { data, error } = await useFetch(
      `${config.public.API_BASE_URL}api/users/update-profile/`,
      {
        method: "PUT",
        body: userData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (error.value) {
      return { error: error.value, data: null };
    }

    return { data: data.value, error: null };
  } catch (err) {
    return { error: err, data: null };
  }
};

const changePassword = async (passwordData: { current_password: string; new_password: string }) => {
  // Get token from cookie or store
  const token = accessTokenCookie.value || userStore.token;

  if (!token) {
    return { error: "No access token available", data: null };
  }

  try {
    const res = await $fetch(
      `${config.public.API_BASE_URL}api/users/change-password/`,
      {
        method: "POST",
        body: passwordData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    return { data: res, error: null };
  } catch (error: any) {
    return {
      error: error?.data?.new_password?.[0] || "Failed to change password. Please check your current password and try again.",
      data: null
    };
  }
};

const getAccessToken = () => {
  return accessTokenCookie.value || userStore.token;
};

return {
  login,
  logout,
  getUser,
  updateProfile,
  changePassword,
  refreshAccessToken,
  initializeAuth,
  getAccessToken,
  // Expose cookie refs for direct access if needed
  accessTokenCookie,
  refreshTokenCookie,
};
};