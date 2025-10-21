// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    'nuxt-charts',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  ssr: false,
  nitro: {
    preset: 'static',
  },
  tiptap: {
    prefix: 'Tiptap', 
  },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://api.cyberjab.org/',
    },
  },
})