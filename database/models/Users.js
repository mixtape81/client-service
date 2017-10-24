import Sequelize from 'sequelize';

const UserSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  joinDate: Sequelize.DATE,
  age: Sequelize.INTEGER,
  paidStatus: Sequelize.BOOLEAN,
  genreGroup: Sequelize.INTEGER,
  favoriteArtists: Sequelize.ARRAY(Sequelize.INTEGER),
  favoriteGenres: Sequelize.ARRAY(Sequelize.INTEGER)
};

export default UserSchema;
