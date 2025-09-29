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
      API_BASE_URL: 'https://api.cyberjab.org/',
    }
  }
})