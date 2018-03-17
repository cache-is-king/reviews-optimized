#!/bin/bash

# rm ./_data/concatData.js
# for f in ./_data/output-*.js; do (cat "${f}"; echo) >> ./_data/concatData.js; done
# mongoimport --uri mongodb://localhost/silverspoon_reviews --collection restaurants --file ./_data/concatData.js --numInsertionWorkers 4

for f in ./_data/output-*.js
do
  echo Processing $f...
  mongoimport --uri mongodb://localhost/silverspoon_reviews --collection restaurants --file $f --numInsertionWorkers 4
done
