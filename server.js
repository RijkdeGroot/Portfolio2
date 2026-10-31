/**
 * Zero-dependency Live Development Server
 * Port: 5500 (matches VS Code Live Server standard)
 * Features:
 *  - Accurate MIME types for TTF fonts, SVG, CSS, JS, Images
 *  - Live reload via Server-Sent Events (SSE)
 *  - File watcher on HTML, CSS, JS, Images
 *  - Automatically opens default browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 5500;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

const liveReloadScript = `
<script>
  // Live Server Auto-Reload
  (function() {
    const es = new EventSource('/live-reload');
    es.onmessage = function(e) {
      if (e.data === 'reload') {
        console.log('[LiveServer] Reloading page...');
        location.reload();
      }
    };
    es.onerror = function() {
      console.log('[LiveServer] Reconnecting...');
    };
  })();
</script>
`;

let clients = [];

// Watch directory for changes
let changeTimeout = null;
fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const ext = path.extname(filename).toLowerCase();
  if (['.html', '.css', '.js', '.svg', '.jpg', '.png', '.mp4'].includes(ext)) {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      console.log(`[LiveServer] Change detected in ${filename}. Notifying clients...`);
      clients.forEach(res => res.write('data: reload\n\n'));
    }, 100);
  }
});

const server = http.createServer((req, res) => {
  // SSE endpoint
  if (req.url === '/live-reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    clients.push(res);
    req.on('close', () => {
      clients = clients.filter(client => client !== res);
    });
    return;
  }

  // File resolution
  const urlPath = req.url.split('?')[0];
  let relativePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  let filePath = path.join(ROOT_DIR, relativePath);

  // Fallback for directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 Not Found</h1><p>The requested file does not exist.</p>');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  if (ext === '.html') {
    fs.readFile(filePath, 'utf-8', (err, html) => {
      if (err) {
        res.writeHead(500);
        return res.end('Server Error');
      }
      // Inject live reload script before </body>
      const injectedHtml = html.includes('</body>')
        ? html.replace('</body>', `${liveReloadScript}</body>`)
        : html + liveReloadScript;

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(injectedHtml);
    });
  } else {
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`[LiveServer] Running live server at: ${url}`);
  console.log(`[LiveServer] Serving directory: ${ROOT_DIR}`);

  // Open default browser on Windows
  exec(`start ${url}`);
});
