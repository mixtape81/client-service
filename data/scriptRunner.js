/* eslint no-param-reassign: 0 */

import createLocations from './locations';
import createUsers from './users';

const createUserBatches = (number, count = 0) => {
  count += 1;
  return count <= number ? createUsers().then(() =>
    createUserBatches(number, count)) : null;
};

createLocations().then(() => createUserBatches(Math.ceil(9305064 / 1000)))
  .catch(err => console.error(err));
