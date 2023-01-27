const Sequelize = require('sequelize');
const path = require("path");

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join("nodeproject","ouput","traffic_data")
});

const Response = sequelize.define('response', {
  distance: {
    type: Sequelize.STRING
  },
  duration: {
    type: Sequelize.STRING
  },
  duration_traffic: {
    type: Sequelize.STRING
  }
});

const initializeDb = async () => {
  try {
    await sequelize.sync();
    console.log('Database initialized and synced with models.');
  } catch (error) {
    console.log('Error initializing the database:', error);
  }
};

module.exports = {
  initializeDb,
  Response,
  sequelize
}
