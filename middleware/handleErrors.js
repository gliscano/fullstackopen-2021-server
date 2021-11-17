module.exports = (error, request, response,) => {
  console.error(error);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'Id used is malformad' });
  } else {
    response.status(503).end();
  }
};