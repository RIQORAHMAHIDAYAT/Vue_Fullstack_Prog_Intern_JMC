// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-01",

  devtools: { enabled: process.env.NODE_ENV !== "production" },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      appClient: process.env.APP_CLIENT,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "3m",
  },

  nitro: {
    experimental: {
      openAPI: process.env.NODE_ENV !== "production",
    },
    externals: {
      external: ["xlsx"]
    }
  },

  css: [
    "@tabler/core/dist/css/tabler.min.css",
    "~/assets/css/backend.css",
  ],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
      script: [],
    },
  },

  modules: [],

  plugins: [
    "~/plugins/jquery.client.js",
    "~/plugins/tabler.client.js",
    "~/plugins/apexcharts.client.js",
  ],

  vite: {
    optimizeDeps: {
      include: ["apexcharts"],
    },
  },
});
