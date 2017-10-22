import expect from 'chai';
import Sequelize from 'sequelize';
import pgCreds from '../credentials/pgCreds';

const sequelize = new Sequelize({
  database: pgCreds.databaseSpec,
  username: pgCreds.username,
  password: pgCreds.password,
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .catch(err => console.error('Problem with Postgres: ', err));

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  joinDate: Sequelize.DATE,
  birthDate: Sequelize.DATE,
  location: Sequelize.STRING,
  paidStatus: Sequelize.BOOLEAN,
  genreGroup: Sequelize.INTEGER,
  favoriteArtists: Sequelize.ARRAY(Sequelize.INTEGER)
});

User.sync()
  .catch(err => console.error('Error syncing users: ', err));

const clearDB = (connection, done) => {
  sequelize.drop()
    .then(() => done());
};

beforeEach((done) => {
  clearDB(sequelize, () => {
    sequelize.sync()
      .then(() => done());
  });
});

describe('Database Schema', () => {
  it('should contain a users table', (done) => {
    sequelize.Users.findAll({})
      .then((err, results) => {
        if (err) { return done(err); }

        expect(results).to.deep.equal([]);
        done();
      });
  });
});
