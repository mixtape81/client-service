import fs from 'fs';
import db from '../database/database';

const chanceGenerator = () => Math.floor(Math.random() * 101);

const generateLocationChances = () => db.Location.findAll()
  .then((results) => {
    let totalPop = 0;
    const cityPop = {};
    let percentage = 0;
    results.forEach((result) => {
      totalPop += result.population;
    });
    results.forEach((result) => {
      percentage += result.population / totalPop;
      cityPop[result.id] = percentage;
    });
    return cityPop;
  });

const generateLocationId = (cityPop) => { // eslint-disable-line consistent-return
  const random = Math.random();
  for (const key of Object.keys(cityPop)) { // eslint-disable-line no-restricted-syntax
    if (random <= cityPop[key]) {
      return Number(key);
    }
  }
};

const generateAge = () => {
  const chance = chanceGenerator();
  if (chance < 56) {
    return Math.ceil((Math.random() * (34 - 18)) + 18);
  } else if (chance < 86) {
    return Math.ceil((Math.random() * (50 - 35)) + 35);
  } else if (chance < 96) {
    return Math.ceil((Math.random() * (70 - 51)) + 51);
  }
  return Math.ceil((Math.random() * (90 - 71)) + 71);
};

const generateJoinDate = (start, end) =>
  new Date(start.getTime() + (Math.random() *
  (end.getTime() - start.getTime())));

const generatePaidStatus = () => {
  const chance = chanceGenerator();
  if (chance < 61) {
    return false;
  }
  return true;
};

const generateFavoriteArtists = () => {
  const favoriteArtists = [];
  const artistStorage = {};
  while (Object.keys(artistStorage).length < 5) {
    const randomId = Math.ceil(Math.random() * 500000);
    if (!artistStorage[randomId]) {
      favoriteArtists.push(randomId);
      artistStorage[randomId] = true;
    }
  }
  return favoriteArtists;
};

const generateFavoriteGenres = () => {
  const favoriteGenres = [];
  const genreStorage = { 7: true };
  while (Object.keys(genreStorage).length < 5) {
    const randomId = Math.ceil(Math.random() * 10);
    if (!genreStorage[randomId]) {
      favoriteGenres.push(randomId);
      genreStorage[randomId] = true;
    }
  }
  return favoriteGenres;
};

const yyyymmdd = (date) => {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};

const formatArray = array =>
  JSON.stringify(array).replace(/\[/g, '{').replace(/]/g, '}');

const generateUserOptions = filePath => generateLocationChances()
  .then((cityPop) => {
    const options = [];
    options.push(generateAge());
    options.push(generatePaidStatus());
    options.push(formatArray(generateFavoriteArtists()));
    const favoriteGenres = generateFavoriteGenres();
    options.push(formatArray(favoriteGenres));
    options.push(favoriteGenres[0]);
    options.push(yyyymmdd(generateJoinDate(new Date(2014, 0, 1), new Date(2017, 5, 1))));
    options.push(generateLocationId(cityPop));
    return new Promise((resolve) => {
      fs.appendFile(filePath, `${options.join(';')}\n`, result =>
        resolve(result));
    });
  });

export default (filePath, cb) => {
  const promiseArray = [];
  fs.writeFile(filePath, '', (err) => {
    if (err) throw err;
    for (let i = 1; i < 1001; i += 1) {
      promiseArray.push(generateUserOptions(filePath));
    }
    Promise.all(promiseArray).then(results => cb(results));
  });
};
