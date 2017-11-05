/* eslint no-param-reassign: 0 */

import fs from 'fs';
import createUsers from './users';
import db from '../database/database';

const filePath = '/psqltmp/users.csv';
const batches = (1);
let curBatch = 0;

const createUserBatches = () => {
  if (curBatch < batches) {
    createUsers(filePath, () => {
      db.db.query(`COPY
        users(age,"paidStatus","favoriteArtists","favoriteGenres","genreGroup",
          "joinDate","locationId") FROM '${filePath}' DELIMITER ';'`)
        .then(() => {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            curBatch += 1;
            createUserBatches();
          });
        })
        .catch(err => console.error(err));
    });
  }
};

fs.copyFile('./data/cities.csv', '/psqltmp/cities.csv', (err) => {
  if (err) throw err;
  db.db.query('COPY locations(city,latitude,longitude,population) FROM' +
  '\'/psqltmp/cities.csv\' DELIMITER \',\'').then(() => {
    fs.unlink('/psqltmp/cities.csv', unlinkErr => (unlinkErr ?
      console.error(unlinkErr) : null));
    createUserBatches();
  }).catch(error =>
    console.error(error));
});
