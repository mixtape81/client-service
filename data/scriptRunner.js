/* eslint no-param-reassign: 0 */

import createLocations from './locations';
import createUsers from './users';
import db from '../database/database';

const filePath = '/psqltmp/users.csv';
const batches = (10000000 / 1000);
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

createLocations().then(() => createUserBatches()).catch(err =>
  console.error(err));
