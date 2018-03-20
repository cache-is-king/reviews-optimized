const fs = require('fs');
const mongo = require('./mongodb');
const postgres = require('./postgres');

const TOT_DATA_SIZE = 10e6;

const done = () => {
  mongo.mongoose.disconnect();
  postgres.client.end();
};

const randomLinesFromFile = (filename, number) => {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split('\n');
  const output = [];
  for (let s = 0; s < number; s += 1) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    output.push(line);
  }
  return output;
};

const testMongoId = async (totRuns = 1) => {
  console.log('MongoDB findByID test', totRuns, 'iterations');
  console.time('findByRestaurantId');
  for (let i = 0; i < totRuns; i += 1) {
    const needle = Math.floor(TOT_DATA_SIZE * Math.random());
    await mongo.findByRestaurantId(needle);
  }
  console.timeEnd('findByRestaurantId');
  done();
};

const testMongoName = async (totRuns = 1) => {
  console.log('MongoDB findByName test', totRuns, 'iterations');

  // go through un-concatenated files
  const samplesPerFile = Math.floor(totRuns / 40);
  let needles = [];

  for (let j = 0; j < 40; j += 1) {
    const filename = `./_data/output-${(TOT_DATA_SIZE / 40) * (1 + j)}.js`;
    const randomLines = randomLinesFromFile(filename, samplesPerFile)
      .map(JSON.parse)
      .map(item => item.restaurantName);
    needles = needles.concat(randomLines);
  }

  console.log('  ...Restaurant names loaded.  Running test');
  console.time('findByRestaurantName');
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i];
    await mongo.findByRestaurantName(needle);
  }
  console.timeEnd('findByRestaurantName');


  console.log('Ran search on', needles.length, 'needles');
  done();
};


const testPGId = async (numRuns = 1000) => {
  console.log(`PostgreSQL findByID test ${numRuns} iterations`);
  console.time('  findRestaurantById');
  for (let i = 0; i < numRuns; i += 1) {
    await postgres.findRestaurantById(Math.floor(TOT_DATA_SIZE * Math.random()));
  }
  console.timeEnd('  findRestaurantById');

  console.log(`PostgreSQL findReviewsByID test ${numRuns} iterations`);
  console.time('  findReviewsById');
  for (let i = 0; i < numRuns; i += 1) {
    await postgres.findReviewsById(Math.floor(TOT_DATA_SIZE * Math.random()));
  }
  console.timeEnd('  findReviewsById');

  console.log(`PostgreSQL findByRestaurantId test ${numRuns} iterations`);
  console.time('  findByRestaurantId');
  for (let i = 0; i < numRuns; i += 1) {
    await postgres.findByRestaurantId(Math.floor(TOT_DATA_SIZE * Math.random()));
  }
  console.timeEnd('  findByRestaurantId');

  done();
};

const testPGName = async (numRuns = 1000) => {
  console.log(`PostgreSQL findByName test ${numRuns} iterations`);

  // go through un-concatenated files
  const samplesPerFile = Math.floor(numRuns / 10);
  let needles = [];

  for (let j = 0; j < 10; j += 1) {
    const filename = `./_data/rest-${(TOT_DATA_SIZE / 10) * (1 + j)}.tsv`;
    const randomLines = randomLinesFromFile(filename, samplesPerFile)
      .map(line => line.split('\t')[1]);
    needles = needles.concat(randomLines);
  }

  console.log('  ...Restaurant names loaded.  Running test');
  console.time('findRestaurantByName');
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i];
    await postgres.findRestaurantByName(needle);
  }
  console.timeEnd('findRestaurantByName');
  console.log('Ran search on', needles.length, 'needles');


  needles = [];

  for (let j = 0; j < 10; j += 1) {
    const filename = `./_data/rest-${(TOT_DATA_SIZE / 10) * (1 + j)}.tsv`;
    const randomLines = randomLinesFromFile(filename, samplesPerFile)
      .map(line => line.split('\t')[1]);
    needles = needles.concat(randomLines);
  }

  console.log('  ...Restaurant names loaded.  Running test');
  console.time('findReviewsByName');
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i];
    await postgres.findReviewsByName(needle);
  }
  console.timeEnd('findReviewsByName');
  console.log('Ran search on', needles.length, 'needles');


  done();
};

const database = process.argv[2]; // MONGO or PG
const access = process.argv[3]; // NAME or ID
const numRuns = Number(process.argv[4]);

if ((database !== 'mongo' && database !== 'pg') || (access !== 'id' && access !== 'name')) {
  console.log(`Usage: node ${__filename.slice(__dirname.length + 1)} (mongo|pg) (name|id) <number of runs>`);
  process.exit();
}

const fnDict = {
  mongo: {
    id: testMongoId,
    name: testMongoName,
  },
  pg: {
    id: testPGId,
    name: testPGName,
  },
};

fnDict[database][access](numRuns);
