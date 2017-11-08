/* eslint no-param-reassign: 0 */

import fs from 'fs';
import createUsers from './users';
import db from '../database/database';

const filePath = '/psqltmp/users.csv';
let curBatch = 0;
const promiseArray = [];

const createUserBatches = batches => new Promise((resolve, reject) => {
  if (curBatch < batches) {
    createUsers(filePath, () => {
      db.db.query(`COPY
        users(age,"paidStatus","favoriteArtists","favoriteGenres","genreGroup",
        "joinDate","locationId") FROM '${filePath}' DELIMITER ';'`)
        .then(() => {
          fs.unlink(filePath, (err) => {
            if (err) {
              reject(err);
            }
            curBatch += 1;
            promiseArray.push(createUserBatches(batches));
            resolve();
          });
        })
        .catch(err => reject(err));
    });
  } else {
    resolve();
  }
});

export default (batches = 1) => new Promise((resolve, reject) => {
  fs.copyFile('./data/cities.csv', '/psqltmp/cities.csv', (err) => {
    if (err) reject(err);
    db.db.query('COPY locations(city,latitude,longitude,population) FROM' +
    '\'/psqltmp/cities.csv\' DELIMITER \',\'').then(() => {
      fs.unlink('/psqltmp/cities.csv', unlinkErr => (unlinkErr ?
        reject(unlinkErr) : null));
      createUserBatches(batches)
        .then(() => Promise.all(promiseArray).then(() => resolve()));
    })
      .catch(error => reject(error));
  });
});
