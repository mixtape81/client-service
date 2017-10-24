const Sequelize = require('sequelize');
const pgCreds = require('../credentials/pgCreds');

const databaseName = process.env.NODE_ENV === 'test' ?
  pgCreds.databaseSpec : pgCreds.database;

const db = new Sequelize({
  database: databaseName,
  username: pgCreds.username,
  password: pgCreds.password,
  dialect: 'postgres',
  logging: false
});

db.authenticate()
  .catch(err => console.error('Problem with Postgres: ', err));

const LocationSchema = require('./models/Locations');
const UserSchema = require('./models/Users');

const Location = db.define('location', LocationSchema);
const User = db.define('user', UserSchema);

Location.hasMany(User);
User.belongsTo(Location);

if (process.env.NODE_ENV !== 'test') {
  Location.sync()
    .then(() => User.sync())
    .catch(err => console.error('Error syncing users: ', err));
}

module.exports = {
  db,
  Location,
  User
};
