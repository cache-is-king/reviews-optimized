const nr = require('newrelic');
const fs = require('fs');
const http = require('http');
const path = require('path');
const mime = require('mime-types');
const redis = require('redis');
const bluebird = require('bluebird');
const db = require('../db/mongodb');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const port = process.env.PORT || 8081;

const client = redis.createClient({ host: process.env.REDIS_HOST });

const statistics = {
  cacheHit: 0,
  cacheMiss: 0,
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET' && req.url.startsWith('/restaurants')) {
    // REST request
    const id = Number(req.url.split('/')[2]);
    client.getAsync(id)
      .then((result) => {
        if (result === null) {
          // console.log(`  ${id} resolves to null, getting from DB...`);
          db.findByRestaurantId(id)
            .then((results) => {
              res.writeHead(200, {
                'Content-Type': 'application/json',
              });
              const jsonString = JSON.stringify(results);
              res.end(jsonString);
              client.set(id, jsonString, 'EX', 90);
            })
            .catch((err) => {
              console.log('[ERROR]', err.message);
              res.writeHead(500);
              res.end('Internal Server Error');
            });
          statistics.cacheMiss += 1;
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/json',
          });
          // console.log(`  ${id} resolves to ${result}`);
          res.end(result);
          statistics.cacheHit += 1;
        }
      });
  } else {
    // regular filename
    const reqFile = req.url.slice(1) !== '' ? req.url.slice(1) : 'index.html';
    const filename = path.join(__dirname, '..', 'react', 'dist', reqFile);

    // check to see if in redis
    client.getAsync(filename)
      .then((results) => {
        if (results === null) {
          // if not in redis,

          fs.readFile(filename, (err, data) => {
            if (err) {
              console.log(err);
              res.statusCode = 404;
              res.end('404 Not Found');
            } else {
              res.writeHead(200, {
                'Content-Type': mime.lookup(filename),
              });
              res.end(data);
              client.set(filename, data, 'EX', 600); // cache for 10 mins
            }
          });
          statistics.cacheMiss += 1;
        } else {
          // if in redis,
          res.writeHead(200, {
            'Content-Type': mime.lookup(filename),
          });
          res.end(results);
          statistics.cacheHit += 1;
        }
      });
  }
});

server.listen(port, () => {
  console.log('NewRelic', nr.agent.config.license_key.slice(0, 10), '...');
  console.log('Server listening on', port);
});

process.on('SIGINT', () => {
  const total = Math.max(1, statistics.cacheHit + statistics.cacheMiss);
  console.log('Redis hits: %', (100 * (statistics.cacheHit / total)).toFixed(1));
  console.log('Redis misses: %', (100 * (statistics.cacheMiss / total)).toFixed(1));
  console.log('Total lookups:', total);
  process.exit();
});

module.exports = server;
