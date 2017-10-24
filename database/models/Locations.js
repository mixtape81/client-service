const Sequelize = require('sequelize');

const LocationSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
};

module.exports = LocationSchema;
