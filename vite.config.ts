import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // The contact form posts to /api/contact, which is public/api/contact.php
      // in production. To try it locally, run this next to `pnpm dev`:
      //   MYSPA_CONTACT_DRY_RUN=1 php -S localhost:8000 -t public
      // Dry run logs the email to that terminal instead of sending it.
      proxy: {
        '/api/contact': {
          target: 'http://localhost:8000',
          rewrite: () => '/api/contact.php'
        }
      }
    },
    preview: {
      port: 3000
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  }
})
