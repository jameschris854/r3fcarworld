import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,  // or '0.0.0.0' to bind to all addresses
    port: 5173,  // This is the default, but you can specify a different one if needed
  }
});