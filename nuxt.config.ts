// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    'nuxt-charts',
    'nuxt-tiptap-editor',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  tiptap: {
    prefix: 'Tiptap', 
  },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://api.cyberjab.org/',
      API_TOKEN:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5OTUwNzI2LCJpYXQiOjE3NTkzNDU5MjYsImp0aSI6IjViMTYyYmRkYTkyMDRmYWQ4OTRmMjU1ZmQxY2E5ZmI5IiwidXNlcl9pZCI6MiwidG9rZW5fdXVpZCI6IjBhNGQ5MzRhLWVlMzktNDJkMC1hNWE2LWEzYTNhNDlkYzQ0NSJ9.pzM7jeL6BzA2W5ZUWwRSP82gKVG5Ds7AkOf63UlIids',
    },
  },
})
