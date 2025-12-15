#!/usr/bin/env node

import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

(async () => {
  try {
    // Start Vite in middleware mode to serve the app programmatically
    const server = await createServer({
      configFile: false,
      root: root,
      server: {
        port: 0, // 0 tells Vite/Node to find a random available port
        host: '127.0.0.1',
      },
      plugins: [
        // We import the React plugin dynamically.
        (await import('@vitejs/plugin-react')).default(),
      ],
      optimizeDeps: {
        // Pre-bundle these dependencies to make the page load faster
        include: ['react', 'react-dom', 'lucide-react', '@google/genai'],
      },
      logLevel: 'error', // Reduce noise in the terminal
    });

    await server.listen();

    const address = server.httpServer.address();
    const port = typeof address === 'object' && address !== null ? address.port : 3000;
    const url = `http://127.0.0.1:${port}`;

    console.log('\n\x1b[36m%s\x1b[0m', '💠 DataFormatX is active.');
    console.log('\x1b[90m%s\x1b[0m', `   Running at ${url}`);
    console.log('\x1b[90m%s\x1b[0m', '   Press Ctrl+C to stop.');

    open(url);
  } catch (e) {
    console.error('Failed to start DataFormatX:', e);
    process.exit(1);
  }
})();