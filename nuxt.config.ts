// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    "nuxt-charts",
    'nuxt-tiptap-editor',
    '@pinia/nuxt',
    // '@nuxt/ui',
  ],
  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // API_BASE_URL: 'http://localhost:8000/',
      API_BASE_URL: 'https://api.cyberjab.org/',
      API_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5NzYwMzkxLCJpYXQiOjE3NTkxNTU1OTEsImp0aSI6IjE2Yjk3ZWE1ZmIyZjQ1YWQ4MzhjOTE1YjhhYmFkNTUzIiwidXNlcl9pZCI6MiwidG9rZW5fdXVpZCI6IjkxMDgxYzliLTQ0MDQtNDU2Yi05ZGJmLWUwNGFjNmQ4MDk5ZiJ9.MLa3NGLlzxHZYow69vpJp6TtizU2-_VC6w3typANNUk"
    }
  }
})