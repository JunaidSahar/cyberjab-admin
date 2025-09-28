import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
    token: null as string | null
  }),

  actions: {
    setUser(userData: any) {
      this.user = userData;
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
    },

    // Initialize auth state from cookies (for SSR/client hydration)
    initializeFromCookies() {
      // This will be called from the auth composable where useCookie is available
    }
  }
});