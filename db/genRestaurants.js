const faker = require('faker');
const fs = require('fs');
const { BloomFilter } = require('bloomfilter');

// city
// faker.address.city();

// name
// faker.name.firstName();
// faker.name.lastName();

// date w/in last 3 months
// faker.date.past(0.25); // within last three months

// review
// faker.lorem.sentences(); // 2-6 sentences

// faker.lorem.text(); // randomly selects one lorem function


const capitalize = (str) => {
  const words = str.split(' ');
  const output = words.map(word => {
    return word[0].toUpperCase() + word.slice(1);
  })
  .join(' ');
  return output;
}

const genRestName = () => {

  const randomFn = {
    0: () => {
      return faker.lorem.words(1 + Math.floor(3 * Math.random()));
    },
    1: () => {
      return 'The ' + faker.lorem.word();
    },
    2: () => {
      return faker.lorem.word() + ' & ' + faker.lorem.word();
    },
    3: () => {
      return faker.name.firstName() + '\'s ' + faker.lorem.words(1 + Math.floor(2 * Math.random()));
    },
    4: () => {
      return faker.commerce.productAdjective() + ' ' + faker.lorem.words(1 + Math.floor(2 * Math.random()));
    },
  };

  return randomFn[Math.floor(5 * Math.random())]();
};

let totSaved = 0;
// size of bloomfilter, per https://hur.st/bloomfilter?n=10000000&p=1.0E-6
const bloom = new BloomFilter(287551752, 20);
let output = [];
const totalNum = 10000000;
let i = 0;

// for (let i = 0; i < totalNum; i += 1) {
while (true) {
  const restName = capitalize(genRestName());
  if (!bloom.test(restName)) {
    // restaurant not in bloom filter
    bloom.add(restName);
    output.push(restName);
    if (i >= totalNum || (i !== 0 && i % 1000000 === 0)) {
      console.log(i);
      // write all objects that have not yet been written to disk
      const unWrittenNames = output.map((item, j) => ({ id: totSaved + j, name: item }));

      totSaved += output.length;

      console.log(`Writing ${output.length} keys to [output-${i}.js]`);

      // set from false to true for those keys
      const jsonString = JSON.stringify(unWrittenNames, null, 2);
      fs.writeFileSync(`./output-${i}.js`, jsonString);
      output = [];
      if (totSaved > totalNum) {
        break;
      }
    }
    i += 1;
  }
}