import Sequelize from 'sequelize';
import pgCreds from '../credentials/pgCreds';
import LocationSchema from './models/Locations';
import UserSchema from './models/Users';

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

const Location = db.define('location', LocationSchema);
const User = db.define('user', UserSchema);

Location.hasMany(User);
User.belongsTo(Location);

if (process.env.NODE_ENV !== 'test') {
  Location.sync()
    .then(() => User.sync())
    .catch(err => console.error('Error syncing users: ', err));
}

export default {
  db,
  Location,
  User
};
