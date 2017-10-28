import Sequelize from 'sequelize';

const UserSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  age: Sequelize.INTEGER,
  paidStatus: Sequelize.BOOLEAN,
  favoriteArtists: Sequelize.ARRAY(Sequelize.INTEGER),
  favoriteGenres: Sequelize.ARRAY(Sequelize.INTEGER),
  genreGroup: Sequelize.INTEGER,
  joinDate: Sequelize.STRING
};

export default UserSchema;
