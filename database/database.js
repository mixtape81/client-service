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

const UserSchema = require('./models/Users.js');

const User = db.define('user', UserSchema);
if (process.env.NODE_ENV !== 'test') {
  User.sync()
    .catch(err => console.error('Error syncing users: ', err));
}

module.exports = {
  db,
  User
};
