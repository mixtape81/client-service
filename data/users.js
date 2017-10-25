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
  for (let i = 0; i < 5; i += 1) {
    favoriteArtists.push(Math.ceil(Math.random() * 1000));
  }
  return favoriteArtists;
};

const generateFavoriteGenres = () => {
  const favoriteGenres = [];
  for (let i = 0; i < 5; i += 1) {
    favoriteGenres.push(Math.ceil(Math.random() * 1000));
  }
  return favoriteGenres;
};

const createUser = (count) => {
  const options = {};
  options.locationId = generateLocationId();
  options.age = generateAge();
  options.joinDate = generateJoinDate(new Date(2014, 0, 1), new Date(2017, 5, 1));
  options.paidStatus = generatePaidStatus();
  options.genreGroup = Math.ceil(Math.random() * 9);
  options.favoriteArtists = generateFavoriteArtists();
  options.favoriteGenres = generateFavoriteGenres();

  return db.User.create(options)
    .then(() => {
      if (count < 1000) {
        createUser(count + 1);
      }
    })
    .catch(err => console.error(err));
};

export default createUser;
