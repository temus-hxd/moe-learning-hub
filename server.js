import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

// Load environment variables (only in local development)
// Vercel automatically provides environment variables
if (process.env.VERCEL !== "1") {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use process.cwd() in Vercel, __dirname in local development
// In Vercel serverless, __dirname points to the function directory,
// but process.cwd() points to the project root where HTML files are
const rootDir = process.env.VERCEL ? process.cwd() : __dirname;

const app = express();
const PORT = process.env.PORT || 8000;

// Inject environment variables into HTML files FIRST (before static middleware)
// This ensures HTML files get the injected environment variables
app.use((req, res, next) => {
  // Only process HTML files and root path
  if (req.path.endsWith(".html") || req.path === "/" || req.path === "") {
    // Remove leading slash from path for file system operations
    const cleanPath = req.path === "/" || req.path === "" 
      ? "index.html" 
      : req.path.startsWith("/") 
        ? req.path.slice(1) 
        : req.path;
    
    const filePath = join(rootDir, cleanPath);

    // Debug logging for Vercel
    if (process.env.VERCEL) {
      console.log(`HTML request: ${req.path} -> ${filePath}`);
      console.log(`Root dir: ${rootDir}, __dirname: ${__dirname}, cwd: ${process.cwd()}`);
      console.log(`File exists: ${existsSync(filePath)}`);
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      console.error(`HTML file not found: ${filePath}`);
      return res.status(404).json({
        error: "Not Found",
        path: req.path,
        filePath: filePath,
        rootDir: rootDir,
        __dirname: __dirname,
        cwd: process.cwd()
      });
    }

    try {
      let html = readFileSync(filePath, "utf8");

      // Get API key from environment (works in both local and Vercel)
      const apiKey = process.env.OPENROUTER_API_KEY || "";

      // Inject environment variables as a script tag before </head>
      const envScript = `
    <script>
      window.ENV = {
        OPENROUTER_API_KEY: ${JSON.stringify(apiKey)}
      };
    </script>`;

      // Only inject if </head> exists and script not already injected
      if (html.includes("</head>") && !html.includes("window.ENV")) {
        html = html.replace("</head>", `${envScript}\n</head>`);
      }

      res.setHeader("Content-Type", "text/html");
      res.send(html);
      return; // Don't continue to next middleware
    } catch (err) {
      console.error("Error serving HTML:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        path: req.path,
        message: err.message
      });
    }
  } else {
    next();
  }
});

// Serve static files (CSS, JS, images, etc.) AFTER HTML injection
// Serve static files from public directory (works in both local and Vercel)
const publicPath = join(rootDir, "public");
app.use(
  express.static(publicPath, {
    maxAge: "1y",
    etag: true,
  })
);

// Debug logging for Vercel (remove in production if needed)
if (process.env.VERCEL) {
  console.log("Vercel environment detected");
  console.log("Root dir:", rootDir);
  console.log("Public path:", publicPath);
  console.log("Public exists:", existsSync(publicPath));
  console.log("Index.html exists:", existsSync(join(rootDir, "index.html")));
  console.log("Screen1.html exists:", existsSync(join(rootDir, "screen1.html")));
}

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    hasApiKey: !!process.env.OPENROUTER_API_KEY,
  });
});

// Catch-all handler for requests that don't match HTML or API routes
// In Vercel, static files are served automatically from public/, so this
// will only catch HTML files and API routes (which are handled above)
// For static files, we should let Vercel handle them (they shouldn't reach here)
app.use((req, res) => {
  // Check if this is a static file request (shouldn't happen on Vercel)
  // On Vercel, static files are served before reaching this handler
  // Only return 404 for actual missing routes
  res.status(404).json({
    error: "Not Found",
    path: req.path,
  });
});

// Start server only in local development
// Vercel will use this as a serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `🔑 API Key configured: ${process.env.OPENROUTER_API_KEY ? "Yes" : "No"}`
    );
  });
}

// Export for Vercel serverless
export default app;
