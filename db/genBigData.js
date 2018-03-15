const faker = require('faker');
const fs = require('fs');
const { BloomFilter } = require('bloomfilter');

const capitalize = str => str.split(' ')
  .map(word => word[0].toUpperCase() + word.slice(1))
  .join(' ');

const genRestName = () => {
  const randomFn = {
    0: () => (faker.lorem.words(1 + Math.floor(3 * Math.random()))),
    1: () => (`The ${faker.lorem.word()}`),
    2: () => (`${faker.lorem.word()} & ${faker.lorem.word()}`),
    3: () => (`${faker.name.firstName()}'s ${faker.lorem.words(1 + Math.floor(2 * Math.random()))}`),
    4: () => (`${faker.commerce.productAdjective()} ${faker.lorem.words(1 + Math.floor(2 * Math.random()))}`),
  };

  return randomFn[Math.floor(5 * Math.random())]();
};

const generateReviews = (chunkSize) => {
  const output = [];

  for (let i = 0; i < chunkSize; i += 1) {
    output.push({
      // id: i,
      username: faker.internet.userName(),
      city: faker.address.city(),
      dinedDate: faker.date.past(0.25).toISOString().slice(0, 10),
      rating: Math.floor(1 + (5 * Math.random())),
      review: faker.lorem.text(),
    });
  }
  return output;
};

let totSaved = 0;
// size of bloomfilter, per https://hur.st/bloomfilter?n=10000000&p=1.0E-6
const bloom = new BloomFilter(287551752, 20);
let output = [];
const totalNum = 10000000;
let i = 0;

const handleMap = (item, j) => ({
  restaurantId: totSaved + j,
  restaurantName: item,
  restaurantReviews: generateReviews(Math.floor(5 * Math.random())),
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
      // const jsonString = JSON.stringify(restaurantObjects);
      const outputString = restaurantObjects.map(JSON.stringify).join('\n');
      fs.writeFileSync(`./_data/output-${i}.js`, outputString);
      output = [];
    }
    i += 1;
  }
}
