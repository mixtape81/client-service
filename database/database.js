import Sequelize from 'sequelize';
import pgCreds from '../credentials/pgCreds';
import LocationSchema from './models/Locations';
import UserSchema from './models/Users';

const databaseName = process.env.POSTGRES_DB || process.env.NODE_ENV === 'test'
  ? pgCreds.databaseSpec : pgCreds.database;
const databaseUsername = process.env.POSTGRES_USER || pgCreds.username;
const databasePassword = process.env.POSTGRES_PASSWORD || pgCreds.password;

const db = new Sequelize({
  database: databaseName,
  username: databaseUsername,
  password: databasePassword,
  dialect: 'postgres',
  logging: false
});

db.authenticate()
  .catch(err => console.error('Problem with Postgres: ', err));

const Location = db.define('location', LocationSchema, { timestamps: false });
const User = db.define('user', UserSchema, { timestamps: false });

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
