import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const PORT = 3000;

// 1. Initial Build
console.log('🚀 [Dev] Running initial build...');
exec('npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error(`Build failed: ${err}`);
    return;
  }
  console.log('✅ [Dev] Initial build complete.');
  startServer();
  startWatcher();
});

// 2. Start HTTP Server
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    if (!path.extname(filePath)) {
      filePath = path.join(filePath, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>', 'utf-8');
        } else {
          res.writeHead(500);
          res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`🌐 [Dev] Local development server running at http://localhost:${PORT}`);
  });
}

// 3. Watch for changes
function startWatcher() {
  let debounceTimer;
  
  const triggerRebuild = (eventType, filename) => {
    if (!filename) return;
    
    // Ignore dotfiles and temp files
    if (filename.startsWith('.') || filename.endsWith('~')) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n🔄 [Dev] Detected change in ${filename}. Rebuilding...`);
      const startTime = Date.now();
      
      exec('npm run build', (err, stdout, stderr) => {
        if (err) {
          console.error(`❌ [Dev] Build failed:`);
          console.error(stderr);
          return;
        }
        console.log(`⚡ [Dev] Rebuild finished in ${Date.now() - startTime}ms.`);
      });
    }, 300);
  };

  // Watch tools directory
  fs.watch(TOOLS_DIR, { recursive: true }, triggerRebuild);
  
  // Watch src directory
  fs.watch(SRC_DIR, { recursive: true }, triggerRebuild);

  console.log(`👀 [Dev] Watching for file changes in ./tools and ./src...`);
}
