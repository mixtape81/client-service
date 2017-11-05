/* eslint no-param-reassign: 0 */

import fs from 'fs';
import createUsers from './users';
import db from '../database/database';

const filePath = '/psqltmp/users.csv';
const batches = (1);
let curBatch = 0;

const createUserBatches = () => {
  if (curBatch < batches) {
    createUsers(curBatch, filePath, () => {
      db.db.query(`COPY users FROM '${filePath}' DELIMITER ';'`)
        .then(() => {
          curBatch += 1;
          createUserBatches();
        })
        .catch(err => console.error(err));
    });
  }
};

fs.copyFile('./data/cities.csv', '/psqltmp/cities.csv', (err) => {
  if (err) throw err;
  db.db.query('COPY locations(city,latitude,longitude,population) FROM' +
  '\'/psqltmp/cities.csv\' DELIMITER \',\'').then(() =>
    createUserBatches()).catch(error =>
    console.error(error));
});
