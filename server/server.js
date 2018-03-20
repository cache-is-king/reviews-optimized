const nr = require('newrelic');
const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../db/mongodb');
// const fs = require('fs');
// const _ = require('underscore');

const app = express();

// app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../react/dist`));

app.get('/restaurants/:id', (request, response) => {
  response.set({ 'Access-Control-Allow-Origin': '*' });
  db.findByRestaurantId(request.params.id)
    .then((results) => {
      response.json(results);
    })
    .catch((err) => {
      console.log('[ERROR]', err.message);
      response.sendStatus(500);
    });
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(nr);
  console.log(`Server Up on port: ${port}`);
});

module.exports = app;
