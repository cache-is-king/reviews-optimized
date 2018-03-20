const mongo = require('./mongodb');
const postgres = require('./postgres');

const TOT_DATA_SIZE = 10e6;

const done = () => {
  mongo.mongoose.disconnect();
  postgres.client.end();
};

const testLoad = (dbFunction, label, numRuns = 1000) => {
  console.log(`${label} load test ${numRuns} queries`);
  const promises = [];
  console.time('  findByRestaurantId');
  for (let i = 0; i < numRuns; i += 1) {
    promises.push(dbFunction(Math.floor(TOT_DATA_SIZE * Math.random())));
  }
  Promise.all(promises)
    .then((results) => {
      console.timeEnd('  findByRestaurantId');
      console.log('Result sanity check', results[0]);
      done();
    });
};

const fnDict = {
  mongo: mongo.findByRestaurantId,
  pg: postgres.findByRestaurantId,
};

const numRuns = Number(process.argv[3]);
const db = process.argv[2];

if (db !== 'mongo' && db !== 'pg') {
  console.log(`Usage: node ${__filename.slice(__dirname.length + 1)} (mongo|pg) <number of queries>`);
  process.exit();
}

testLoad(fnDict[db], db, numRuns);
