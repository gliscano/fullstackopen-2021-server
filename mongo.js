const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
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