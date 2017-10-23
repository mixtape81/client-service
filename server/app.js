const express = require('express');
const db = require('../database/database');

const app = express();

app.post('/users', (req, res) => {
  const user = {
    joinDate: new Date(),
    birthDate: new Date(),
    location: 'San Francisco',
    paidStatus: true,
    genreGroup: 3,
    favoriteArtists: [4, 2, 6, 8]
  };

  db.User.create(user)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
      res.send(400);
    });
});

module.exports = app;
