const faker = require('faker');
const fs = require('fs');
const { BloomFilter } = require('bloomfilter');

const capitalize = str => str.split(' ')
  .map(word => word[0].toUpperCase() + word.slice(1))
  .join(' ');

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min));

const genRestName = () => {
  const randomFn = {
    0: () => (faker.lorem.words(randomInt(1, 4))),
    1: () => (`The ${faker.lorem.word()}`),
    2: () => (`${faker.lorem.word()} & ${faker.lorem.word()}`),
    3: () => (`${faker.name.firstName()}'s ${faker.lorem.words(randomInt(1, 3))}`),
    4: () => (`${faker.commerce.productAdjective()} ${faker.lorem.words(randomInt(1, 3))}`),
  };

  return capitalize(randomFn[randomInt(0, 5)]());
};

const generateReviews = (numReviews) => {
  const output = [];

  for (let i = 0; i < numReviews; i += 1) {
    output.push({
      // id: i,
      username: faker.internet.userName(),
      city: faker.lorem.words(randomInt(1, 4)),
      dinedDate: faker.date.past(0.25).toISOString().slice(0, 10),
      rating: randomInt(1, 6),
      review: faker.lorem.text(),
    });
  }
  return output;
};

const genJSON = (totalNum = 1e6) => {
  // size of bloomfilter, per https://hur.st/bloomfilter?n=10000000&p=1.0E-6
  const bloom = new BloomFilter(287551752, 20);
  let output = [];
  let totSaved = 0;
  let i = 0;

  console.log(`Generating ${totalNum} json objects`);

  const handleMap = (item, j) => ({
    restaurantId: totSaved + j,
    restaurantName: item,
    restaurantReviews: generateReviews(randomInt(0, 5)),
  });

  while (totSaved <= totalNum) {
    const restName = genRestName();
    if (!bloom.test(restName)) {
      // restaurant not in bloom filter
      bloom.add(restName);
      output.push(restName);
      if (i >= totalNum || (i !== 0 && i % 250000 === 0)) {
        // write all objects that have not yet been written to disk
        const restaurantObjects = output.map(handleMap);

        totSaved += output.length;

        console.log(`Writing ${output.length} keys to [output-${i}.js]`);

        // set from false to true for those keys
        const outputString = restaurantObjects.map(JSON.stringify).join('\n');
        fs.writeFileSync(`./_data/output-${i}.js`, outputString);
        output = [];
      }
      i += 1;
    }
  }
};

const genTSV = (totalNum = 1e6) => {
  // size of bloomfilter, per https://hur.st/bloomfilter?n=10000000&p=1.0E-6
  const bloom = new BloomFilter(287551752, 20);
  let output = [];
  let totSaved = 0;
  let i = 0;

  console.log(`Generating ${totalNum} tsv lines`);

  while (totSaved <= totalNum) {
    const restName = genRestName();
    if (!bloom.test(restName)) {
      // restaurant not in bloom filter (i.e. unique)
      bloom.add(restName);
      output.push(`${i}\t${restName}`);
      if (i >= totalNum || (i !== 0 && i % 1000000 === 0)) {
        // write all objects that have not yet been written to disk
        totSaved += output.length;

        console.log(`  Writing ${output.length} keys to [rest-${i}.tsv]`);

        const outputString = output.join('\n');
        fs.writeFileSync(`./_data/rest-${i}.tsv`, `${outputString}\n`);
        output = [];
      }
      i += 1;
    }
  }

  // generate all reviews
  totSaved = 0;
  i = 0;
  output = [];
  while (totSaved <= 2 * totalNum) {
    const username = faker.internet.userName();
    const city = faker.lorem.words(randomInt(1, 4));
    const dinedDate = faker.date.past(0.25).toISOString().slice(0, 10);
    const rating = randomInt(1, 6);
    const restaurantId = randomInt(0, totalNum);
    let review = faker.lorem.text();
    review = review.replace(/(\r\n|\n|\r)/gm, '\\n');

    const line = `${username}\t${city}\t${dinedDate}\t${rating}\t${restaurantId}\t${review}`;
    output.push(line);

    if (i >= 2 * totalNum || (i !== 0 && i % 500000 === 0)) {
      // write all objects that have not yet been written to disk
      totSaved += output.length;

      console.log(`  Writing ${output.length} keys to [reviews-${i}.tsv]`);

      const outputString = output.join('\n');
      fs.writeFileSync(`./_data/reviews-${i}.tsv`, `${outputString}\n`);
      output = [];
    }
    i += 1;
  }
};

// pass json or tsv as argument, along with # of records e.g. node genBigData.js json 1000
if (process.argv[2] !== 'json' && process.argv[2] !== 'tsv') {
  console.log(`Usage: node ${__filename.slice(__dirname.length + 1)} (json|tsv) <number_of_restaurants>`);
  process.exit();
}

if (process.argv[2] === 'json') {
  genJSON(Number(process.argv[3]));
} else {
  genTSV(Number(process.argv[3]));
}
