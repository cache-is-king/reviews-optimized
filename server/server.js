const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/mongodb');
// const fs = require('fs');
// const _ = require('underscore');

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../react/dist`));

app.get('/restaurants/:id', (request, response) => {
  response.set({ 'Access-Control-Allow-Origin': '*' });
  db.findByRestaurantId(request.params.id, (err, results) => {
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.json(results);
    }
  });
});

const port = process.env.PORT || 8081;

app.listen(port, () => { console.log(`Server Up on port: ${port}`); });

module.exports = app;
