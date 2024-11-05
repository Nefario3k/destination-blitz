// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      titleTemplate: "%s",
      title: "Destination Blitz",
      meta: [
        // meta data
        { charset: "UTF-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, shrink-to-fit=no",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Destination Blitz",
        },
        { hid: "og:url", property: "og:url", content: "/" },
        {
          hid: "og:description",
          property: "og:description",
          content: "This is for a demo",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "/logo.png",
        },

        // twitter card
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        { hid: "twitter:site", name: "twitter:site", content: "@dbz" },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "Destination Blitz",
        },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: "/",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "This is for a demo",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "/full-logo.png",
        },

        { hid: "author", name: "author", content: "dbz" },
        {
          hid: "description",
          name: "description",
          content: "This is for a demo",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "manifest", href: "/site.webmanifest" },
        {
          hid: "icon",
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          hid: "shortcut-icon",
          rel: "shortcut icon",
          type: "image/png",
          href: "/logo.png",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css",
        },
      ],
      script: [
        {
          src: "https://cdn.lordicon.com/lordicon.js",
          type: "text/javascript",
          body: true,
          defer: false,
        },
      ],
    },
  },

  // sourcemap: false,
  // components: true,
  imports: {
    // dirs: ["~/composables", "~/composables/modules"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
    // "vue-currency-input",
    // "@nuxtjs/sitemap",
    // "@sidebase/nuxt-auth",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  vite: {
    esbuild: {
      // Ensure target is a string
      target: "es2022",
    },
    resolve: {
      alias: {
        // Ensure aliases are strings
        "@": "/src",
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  build: {
    transpile: ["vuetify", "lord-icon"],
  },

  compilerOptions: {
    isCustomElement: (tag: any) => tag.startsWith("lord-icon"),
  },

  css: [
    "~/assets/styles/variables.scss",
    "~/assets/styles/reusable.scss",
    "~/assets/styles/main.scss",
    "~/assets/styles/transitions.scss",
    "~/assets/styles/responsive.scss",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
      env: {
        API_BASE_URL: process.env.API_BASE_URL,
      },
    },
  },

  compatibilityDate: "2024-11-04",
});