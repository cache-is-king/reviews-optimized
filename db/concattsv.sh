#!/bin/sh

rm ./_data/concat-rest.tsv
for f in ./_data/rest-*.tsv
do
  echo Processing $f...
  cat "${f}" >> ./_data/concat-rest.tsv
done

echo Completed... Output is ./_data/concat-rest.tsv

rm ./_data/concat-reviews.tsv
for f in ./_data/reviews-*.tsv
do
  echo Processing $f...
  cat "${f}" >> ./_data/concat-reviews.tsv
done

echo Completed... Output is ./_data/concat-reviews.tsv
