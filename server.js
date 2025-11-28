import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables (only in local development)
// Vercel automatically provides environment variables
if (process.env.VERCEL !== '1') {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Inject environment variables into HTML files FIRST (before static middleware)
// This ensures HTML files get the injected environment variables
app.use((req, res, next) => {
  // Only process HTML files and root path
  if (req.path.endsWith('.html') || req.path === '/' || req.path === '') {
    const filePath = req.path === '/' || req.path === '' 
      ? join(__dirname, 'index.html')
      : join(__dirname, req.path);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return next();
    }
    
    try {
      let html = readFileSync(filePath, 'utf8');
      
      // Get API key from environment (works in both local and Vercel)
      const apiKey = process.env.OPENROUTER_API_KEY || '';
      
      // Inject environment variables as a script tag before </head>
      const envScript = `
    <script>
      window.ENV = {
        OPENROUTER_API_KEY: ${JSON.stringify(apiKey)}
      };
    </script>`;
      
      // Only inject if </head> exists and script not already injected
      if (html.includes('</head>') && !html.includes('window.ENV')) {
        html = html.replace('</head>', `${envScript}\n</head>`);
      }
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      return; // Don't continue to next middleware
    } catch (err) {
      console.error('Error serving HTML:', err);
      next();
    }
  } else {
    next();
  }
});

// Serve static files (CSS, JS, images, etc.) AFTER HTML injection
app.use(express.static(__dirname, {
  maxAge: '1y',
  etag: true
}));

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasApiKey: !!process.env.OPENROUTER_API_KEY
  });
});

// Start server only in local development
// Vercel will use this as a serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 API Key configured: ${process.env.OPENROUTER_API_KEY ? 'Yes' : 'No'}`);
  });
}

// Export for Vercel serverless
export default app;

