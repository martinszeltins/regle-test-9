// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxtjs/i18n'],
  app: {
    head: {
        bodyAttrs: {
            style: 'background-color: #f0f0f0;'
        }
    }
  },
  i18n: {
    locales: [
        {
            code: 'en',
            file: 'en.json',
        },
        {
            code: 'es',
            file: 'es.json',
        },
    ],
    lazy: false,
    langDir: 'lang',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
  },
})
