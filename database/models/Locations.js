import Sequelize from 'sequelize';

const LocationSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
};

export default LocationSchema;
