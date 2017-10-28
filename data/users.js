import db from '../database/database';

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

const generateUserOptions = () => {
  const options = {};
  options.locationId = generateLocationId();
  options.age = generateAge();
  options.createdAt =
    generateJoinDate(new Date(2014, 0, 1), new Date(2017, 5, 1));
  options.joinDate = yyyymmdd(options.createdAt);
  options.paidStatus = generatePaidStatus();
  options.favoriteArtists = generateFavoriteArtists();
  options.favoriteGenres = generateFavoriteGenres();
  [options.genreGroup] = options.favoriteGenres;
  return options;
};

export default () => {
  const promiseArray = [];
  for (let i = 0; i < 1000; i += 1) {
    promiseArray.push(db.User.create(generateUserOptions()));
  }

  return Promise.all(promiseArray);
};
