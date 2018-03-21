const nr = require('newrelic');
const fs = require('fs');
const http = require('http');
const db = require('../db/mongodb');

const port = process.env.PORT || 8081;

const htmlFile = fs.readFileSync('./react/dist/index.html', 'utf8');
const cssFile = fs.readFileSync('./react/dist/reviews.css', 'utf8');
const bundleFile = fs.readFileSync('./react/dist/bundle-prod.js', 'utf8');

const fileCache = {
  'index.html': htmlFile,
  'reviews.css': cssFile,
  'bundle-prod.js': bundleFile,
};

const mimeTypes = {
  '/': 'text/html',
  '/index.html': 'text/html',
  '/reviews.css': 'text/css',
  '/bundle-prod.js': 'application/javascript',
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/restaurants')) {
    const id = Number(req.url.split('/')[2]);
    db.findByRestaurantId(id)
      .then((results) => {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(results));
      })
      .catch((err) => {
        console.log('[ERROR]', err.message);
        res.writeHead(500);
        res.end();
      });
  } else if (['/', '/index.html', '/reviews.css', '/bundle-prod.js'].includes(req.url)) {
    res.writeHead(200, {
      'Content-Type': mimeTypes[req.url],
    });
    const output = req.url === '/' ? fileCache['index.html'] : fileCache[req.url.slice(1)];
    res.end(output);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(nr);
  console.log('Server listening on', port);
});

module.exports = server;
