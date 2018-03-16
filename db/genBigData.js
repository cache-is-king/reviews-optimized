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

  return randomFn[randomInt(0, 5)]();
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
    const restName = capitalize(genRestName());
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
  // let totSaved = 0;
  // const bloom = new BloomFilter(287551752, 20);
  // let output = [];
  // let i = 0;

  console.log(`Generating ${totalNum} tsv lines`);

  // while (totSaved <= totalNum) {
  //   const restName = capitalize(genRestName());
  //   if (!bloom.test(restName)) {
  //     // restaurant not in bloom filter
  //     bloom.add(restName);
  //     output.push(restName);
  //     if (i >= totalNum || (i !== 0 && i % 250000 === 0)) {
  //       // write all objects that have not yet been written to disk
  //       const restaurantObjects = output.map(handleMap);

  //       totSaved += output.length;

  //       console.log(`Writing ${output.length} keys to [output-${i}.js]`);

  //       // set from false to true for those keys
  //       const outputString = restaurantObjects.map(JSON.stringify).join('\n');
  //       fs.writeFileSync(`./_data/output-${i}.js`, outputString);
  //       output = [];
  //     }
  //     i += 1;
  //   }
  // }
};

// pass JSON or TSV as argument, e.g. node genBigData.js JSON
if (process.argv[2] !== 'json' && process.argv[2] !== 'tsv') {
  console.log(`Usage: node ${__filename.slice(__dirname.length + 1)} (json|tsv)`);
  process.exit();
}

if (process.argv[2] === 'json') {
  genJSON();
} else {
  genTSV();
}
