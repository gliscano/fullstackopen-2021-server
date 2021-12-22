/* eslint-disable no-undef */
const mongoose = require('mongoose');
// const connectionString = process.env.MONGO_DB_URI;

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;
const connectionString = (NODE_ENV === 'test')
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI;

// conexion a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.error(err);
  });

process.on('uncaughtException', () => {
  mongoose.connection.close();
});