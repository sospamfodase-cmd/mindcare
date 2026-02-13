import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { postgres } from 'vite-plugin-db';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/resend': {
            target: 'https://api.resend.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/resend/, ''),
            secure: true,
          }
        }
      },
      plugins: [react(), postgres({ referrer: 'dr-bianca-amaral-mindcare' })],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
