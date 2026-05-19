/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
        react(),
        tailwindcss(),
        VitePWA({
        registerType: "autoUpdate",
        devOptions: {
            enabled: true
        },
        includeAssets: ['offline.html'],
        manifest: {
            name: "SKAITRIXA",
            short_name: "SKAITRIXA",
            description: "Galvas rēķinu treniņu platforma",
            theme_color: "#6D28D9",
            background_color: "#F8F9FA",
            display: "standalone",
            icons: [
              {
                  src: "android-chrome-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
              },
              {
                  src: "android-chrome-512x512.png",
                  sizes: "512x512",
                  type: "image/png"
              }
            ]
        },
        workbox: {
            navigateFallback: "/index.html",
            navigateFallbackDenylist: [/\/rest\//, /\/auth\//, /\/functions\//]
        }
      })
  ],
    test: {
      environment: 'happy-dom',
        globals: true,
        setupFiles: './src/test/setup.ts'
    }
})
