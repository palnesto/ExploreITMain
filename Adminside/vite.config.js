import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createServer } from 'http';

// Define allowed origins
const allowedOrigins = ['http://localhost:444', 'http://localhost:3000'];

// Custom middleware to handle CORS
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
}

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    hmr: {
      overlay: "false"
    },

    headers: {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Content-Security-Policy": "upgrade-insecure-requests",
      "Referrer-Policy": "strict-origin-when-cross-origin",

    },
    setupMiddlewares: (middlewares, { app }) => {
      app.use(corsMiddleware); // Use the custom CORS middleware
      return middlewares; // Return the middlewares array
    },
  }
});

