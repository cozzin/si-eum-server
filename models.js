const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: './db.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

const Poem = sequelize.define('Poem', {
  title: Sequelize.STRING,
  contents: Sequelize.TEXT,
  reservationDate: Sequelize.DATE
});

module.exports = {Sequelize, sequelize, User, Poem};
