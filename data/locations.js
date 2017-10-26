import db from '../database/database';

const cities = [
  'New York City',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Philadelphia',
  'Phoenix',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'San Francisco',
  'Indianapolis',
  'Columbus',
  'Fort Worth',
  'Charlotte',
  'Seattle',
  'Denver',
  'El Paso'
];

export default () => {
  const promiseArray = cities.map(city => () =>
    db.Location.create({ name: city }));

  return promiseArray.reduce((create, promise) => create.then(result =>
    promise().then(Array.prototype.concat.bind(result))), Promise.resolve([]));
};
