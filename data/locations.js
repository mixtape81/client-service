import db from '../database/database';

export default () => {
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

  const promiseArray = [];
  cities.forEach(city => promiseArray.push(db.Location.create({ name: city })));
  return Promise.all(promiseArray).catch(err => console.error(err));
};
