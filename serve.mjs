import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import url from 'node:url';
const root = path.dirname(url.fileURLToPath(import.meta.url)); const port = +process.env.PORT || 5391;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.otf':'font/otf','.svg':'image/svg+xml','.mp4':'video/mp4'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('404'); } res.writeHead(200, {'Content-Type': types[path.extname(f)] || 'application/octet-stream'}); res.end(d); });
}).listen(port, () => console.log('http://localhost:' + port));
