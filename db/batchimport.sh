#!/bin/bash

rm ./concatData.js
for f in ./_data/*.js; do (cat "${f}"; echo) >> ./concatData.js; done
mongoimport --uri mongodb://localhost/silverspoon_reviews --collection restaurants --file ./concatData.js --numInsertionWorkers 4
