import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import {
  handleChat,
  handleGenerateDescription,
  handleNaturalSearch,
  handleClassifyPriority,
  handleDailySummary,
  handleCompareVerdict,
  handleAdvisor,
  handleVisualSearch,
  handleHardwareDiagnostics,
  handleTradeInEstimation
} from './src/server/geminiHandler.ts';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-endpoints',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini/')) {
          return next();
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = body ? JSON.parse(body) : {};
            if (req.url === '/api/gemini/chat') {
              const reply = await handleChat(data.message, data.products || []);
              res.end(JSON.stringify({ reply }));
            } else if (req.url === '/api/gemini/generate-description') {
              const description = await handleGenerateDescription(data.name, data.brand, data.category, data.price);
              res.end(JSON.stringify({ description }));
            } else if (req.url === '/api/gemini/smart-search') {
              const result = await handleNaturalSearch(data.query);
              res.end(JSON.stringify(result));
            } else if (req.url === '/api/gemini/classify-priority') {
              const priority = await handleClassifyPriority(data.notes, data.total, data.customerName);
              res.end(JSON.stringify({ priority }));
            } else if (req.url === '/api/gemini/daily-summary') {
              const summary = await handleDailySummary(data.orders || [], data.products || [], data.customers || []);
              res.end(JSON.stringify({ summary }));
            } else if (req.url === '/api/gemini/advisor') {
              const advice = await handleAdvisor(data.query, data.products || []);
              res.end(JSON.stringify(advice));
            } else if (req.url === '/api/gemini/compare-verdict') {
              const verdict = await handleCompareVerdict(data.products || []);
              res.end(JSON.stringify({ verdict }));
            } else if (req.url === '/api/gemini/visual-search') {
              const result = await handleVisualSearch(data.image, data.mimeType || 'image/jpeg', data.products || []);
              res.end(JSON.stringify(result));
            } else if (req.url === '/api/gemini/hardware-diagnostics') {
              const diag = await handleHardwareDiagnostics(data.deviceModel, data.symptoms || [], data.description || '');
              res.end(JSON.stringify(diag));
            } else if (req.url === '/api/gemini/trade-in') {
              const valuation = await handleTradeInEstimation(data.deviceModel, data.storage || '128GB', data.condition || 'ممتاز', data.batteryHealth);
              res.end(JSON.stringify(valuation));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
          } catch (err: any) {
            console.error('API Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      geminiApiPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'WAKNOVA - الوكالة الحديثة للهواتف الذكية ومستلزماتها',
          short_name: 'WAKNOVA',
          description: 'أفخم وأذكى متجر هواتف ذكية وإلكترونيات وملحقات أصلية في اليمن',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
