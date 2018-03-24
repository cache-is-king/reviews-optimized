const TOT_DATA_SIZE = 10e6;
const HIGH_TRAFFIC = 1e2;
const RANGES = 10;
const LOW_TRAFFIC = 1e6 - HIGH_TRAFFIC;

const genID = probability => (Math.random() < probability
  ? Math.floor(HIGH_TRAFFIC * Math.random())
  : Math.floor(HIGH_TRAFFIC + (LOW_TRAFFIC * Math.random())));

const genRandom = (requestParams, context, ee, next) => {
  const rand = Math.floor(TOT_DATA_SIZE * Math.random());
  requestParams.url = requestParams.url.replace('{{replace}}', rand);
  return next(); // MUST be called for the scenario to continue
};

// returns a function that requests a high traffic URL at a
// passed in probability
const genRandomFactory = probability => (requestParams, context, ee, next) => {
  const range = Math.floor(RANGES * Math.random());
  const requestId = ((TOT_DATA_SIZE / RANGES) * range) + genID(probability);
  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};

module.exports = {
  genRandom,
  genRandom50: genRandomFactory(0.50),
  genRandom80: genRandomFactory(0.80),
  genRandom99: genRandomFactory(0.99),
};
