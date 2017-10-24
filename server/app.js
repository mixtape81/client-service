import graphqlHTTP from 'express-graphql';
import schema from '../graphql/schema';

const express = require('express');
const db = require('../database/database');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.post('/users', (req, res) => {
  const location = {
    name: 'San Francisco'
  };
  const user = {
    joinDate: new Date(),
    age: 25,
    paidStatus: true,
    genreGroup: 3,
    favoriteArtists: [4, 2, 6, 8],
    favoriteGenres: [1, 67, 21, 2],
    locationId: 1
  };

  db.Location.create(location)
    .then(() => db.User.create(user))
    .then(result => res.send(result))
    .catch((err) => {
      console.error(err);
      res.send(400);
    });
});

module.exports = app;
