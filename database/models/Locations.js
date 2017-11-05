import Sequelize from 'sequelize';

const LocationSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: Sequelize.STRING,
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING,
  population: Sequelize.STRING
};

export default LocationSchema;
