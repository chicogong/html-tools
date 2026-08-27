import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

const PORT = Number(process.env.PORT || 3000);

// 1. Initial Build
console.log('🚀 [Dev] Running initial sync...');
exec('npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error(`Build failed: ${err}`);
    return;
  }
  console.log('✅ [Dev] Initial sync complete.');
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
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad Request');
      return;
    }
    const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    let filePath = path.resolve(ROOT_DIR, requestedPath);
    if (filePath !== ROOT_DIR && !filePath.startsWith(ROOT_DIR + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    if (!path.extname(filePath)) {
      const htmlFile = filePath + '.html';
      filePath = fs.existsSync(htmlFile) ? htmlFile : path.join(filePath, 'index.html');
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

  server.listen(PORT, '127.0.0.1', () => {
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

  console.log(`👀 [Dev] Watching for file changes in ./tools...`);
}
