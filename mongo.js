/* eslint-disable no-undef */
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_DB_URI;

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