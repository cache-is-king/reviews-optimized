const db = require('./mongodb');

const testMongoDB = async (totRuns = 1) => {
  for (let i = 0; i < totRuns; i += 1) {
    const needle = i < 9
      ? (i * 1e6) + Math.floor(1e6 * Math.random())
      : Math.floor(10e6 * Math.random());

    console.log('Running #', i);
    console.log('  Searching for:', needle);

    console.time('findByRestaurantId');
    const data = await db.findByRestaurantId(needle);
    console.timeEnd('findByRestaurantId');

    console.log('  Found:', data[0].restaurantName);
  }
  if (totRuns > 0) {
    db.mongoose.disconnect();
  }
};

const testMongoDBName = async (needles) => {
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i];

    console.log('Running #', i);
    console.log('  Searching for:', needle);

    console.time('findByRestaurantId');
    // const data = await db.Restaurant.findOne({ restaurantName: needle });
    const data = await db.Restaurant.find({ restaurantName: needle }).limit(1).lean();
    console.timeEnd('findByRestaurantId');

    console.log('  Found:', data[0].restaurantName);
  }

  db.mongoose.disconnect();
};


testMongoDB(10);

// testMongoDB(0);

testMongoDBName([]);

// testMongoDBName([
//   'Edmond\'s Voluptas',
//   'Sofia\'s Doloribus Cum',
//   'Zander\'s Dolores Sit',
//   'Zaria\'s Eum Error',
//   'Lavina\'s Esse Vel',
//   'Nemo Magni Vitae',
//   'Jacinthe\'s Quo Dolore',
//   'Elian\'s Eaque Ratione',
//   'Eryn\'s Totam Incidunt',
//   'Jena\'s Voluptatem Aut',
// ]);
