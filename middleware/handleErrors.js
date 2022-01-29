module.exports = (error, request, response,) => {
  if (error.name === 'CastError') {
    console.log('EEEEERROOR');
    response.status(400).send({ error: 'Id used is malformad' });
  } else {
    response.status(501).end();
  }
};