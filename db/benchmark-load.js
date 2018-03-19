const mongo = require('./mongodb');
const postgres = require('./postgres');

const TOT_DATA_SIZE = 10e6;

const done = () => {
  mongo.mongoose.disconnect();
  postgres.client.end();
};

const testMongoLoad = (totRuns = 1) => {
  console.log('MongoDB load test', totRuns, 'iterations');
  const promises = [];
  console.time('  MongofindByRestaurantId');
  for (let i = 0; i < totRuns; i += 1) {
    const needle = Math.floor(TOT_DATA_SIZE * Math.random());
    promises.push(mongo.findByRestaurantId(needle));
  }
  Promise.all(promises)
    .then((results) => {
      console.timeEnd('  MongofindByRestaurantId');
      console.log('Result sanity check', results[0]);
      done();
    });
};

const testPGLoad = (numRuns = 1000) => {
  console.log(`PostgreSQL load test ${numRuns} iterations`);
  const promises = [];
  console.time('  PostgresfindByRestaurantId');
  for (let i = 0; i < numRuns; i += 1) {
    promises.push(postgres.findByRestaurantId(Math.floor(TOT_DATA_SIZE * Math.random())));
  }

  Promise.all(promises)
    .then((results) => {
      console.timeEnd('  PostgresfindByRestaurantId');
      console.log('Result sanity check', results[0]);
      done();
    });
};

const numRuns = Number(process.argv[2]);
testMongoLoad(numRuns);
// testPGLoad(numRuns);
console.log(testPGLoad);
