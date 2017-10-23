const Sequelize = require('sequelize');

const UserSchema = {
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
};

module.exports = UserSchema;
