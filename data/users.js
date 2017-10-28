import fs from 'fs';

const chanceGenerator = () => Math.floor(Math.random() * 101);

const generateLocationId = () => {
  const chance = chanceGenerator();
  if (chance < 25) {
    return 1;
  } else if (chance < 35) {
    return 2;
  } else if (chance < 43) {
    return 3;
  } else if (chance < 50) {
    return 4;
  } else if (chance < 65) {
    return (Math.ceil(Math.random() * 3)) + 4;
  } else if (chance < 73) {
    return (Math.ceil(Math.random() * 2)) + 7;
  } else if (chance < 91) {
    return (Math.ceil(Math.random() * 6)) + 9;
  }
  return (Math.ceil(Math.random() * 5)) + 15;
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

const generateUserOptions = (id, batch, filePath) => {
  const options = [];
  options.push((1000 * batch) + id);
  options.push(generateAge());
  options.push(generatePaidStatus());
  options.push(formatArray(generateFavoriteArtists()));
  const favoriteGenres = generateFavoriteGenres();
  options.push(formatArray(favoriteGenres));
  options.push(favoriteGenres[0]);
  options.push(yyyymmdd(generateJoinDate(new Date(2014, 0, 1), new Date(2017, 5, 1))));
  options.push(generateLocationId());
  return new Promise((resolve) => {
    fs.appendFile(filePath, `${options.join(';')}\n`, result =>
      resolve(result));
  });
};

export default (batch, filePath, cb) => {
  const promiseArray = [];
  fs.writeFile(filePath, '', (err) => {
    if (err) throw err;
    for (let i = 1; i < 1001; i += 1) {
      promiseArray.push(generateUserOptions(i, batch, filePath));
    }
    Promise.all(promiseArray).then(results => cb(results));
  });
};
