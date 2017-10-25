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

cities.forEach(city => db.Location.create({ name: city }));
