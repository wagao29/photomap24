/// <reference types="vitest" />
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string => html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match)
    }
  };
}

function isProd(env: ReturnType<typeof loadEnv>) {
  return env['VITE_PROJECT_ID'] === 'photomap24-21f9f';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      chunkSizeWarningLimit: 1500
    },
    esbuild: {
      drop: isProd(loadEnv(mode, '.')) ? ['console', 'debugger'] : []
    },
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      htmlPlugin(loadEnv(mode, '.')),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          theme_color: '4B4B4B',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          name: 'PhotoMap24',
          short_name: 'PhotoMap24',
          description: 'location-based photo sharing service that can be viewed for 24 hours only',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: '/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*\.png/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'firebase-storage-cache',
                expiration: {
                  maxEntries: 3000,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ]
  };
});
