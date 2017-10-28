import Sequelize from 'sequelize';

const UserSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  age: Sequelize.INTEGER,
  paidStatus: Sequelize.BOOLEAN,
  genreGroup: Sequelize.INTEGER,
  favoriteArtists: Sequelize.ARRAY(Sequelize.INTEGER),
  favoriteGenres: Sequelize.ARRAY(Sequelize.INTEGER),
  joinDate: Sequelize.STRING
};

export default UserSchema;
