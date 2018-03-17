const fs = require('fs');
const db = require('./mongodb');

const TOT_DATA_SIZE = 10e6;

const testMongoDB = async (totRuns = 1) => {
  console.log('MongoDB findByID test', totRuns, 'iterations');
  console.time('findByRestaurantId');
  for (let i = 0; i < totRuns; i += 1) {
    const needle = Math.floor(TOT_DATA_SIZE * Math.random());
    await db.findByRestaurantId(needle);
  }
  console.timeEnd('findByRestaurantId');
  db.mongoose.disconnect();
};

const testMongoDBName = async (totRuns = 1) => {
  console.log('MongoDB findByName test', totRuns, 'iterations');

  // go through un-concatenated files
  const samplesPerFile = Math.floor(totRuns / 40);
  const needles = [];

  // pick needles at random
  for (let j = 0; j < 40; j += 1) {
    const filename = `./_data/output-${(TOT_DATA_SIZE / 40) * (1 + j)}.js`;
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.split('\n');
    for (let s = 0; s < samplesPerFile; s += 1) {
      const json = lines[Math.floor(Math.random() * lines.length)];
      needles.push(JSON.parse(json).restaurantName);
    }
  }

  console.log('  ...Restaurant names loaded.  Running test');
  console.time('findByRestaurantName');
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i];
    await db.Restaurant.find({ restaurantName: needle }).limit(1).lean();
  }
  console.timeEnd('findByRestaurantName');

  console.log('Ran search on', needles.length, 'needles');
  db.mongoose.disconnect();
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
    id: testMongoDB,
    name: testMongoDBName,
  },
  pg: {
    id: null,
    name: null,
  },
};

fnDict[database][access](numRuns);
