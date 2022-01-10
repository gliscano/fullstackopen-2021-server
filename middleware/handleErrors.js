module.exports = (error, request, response,) => {
  console.error('HANDLE ERROR: ', error);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'Id used is malformad' });
  } else {
    response.status(500).end();
  }
};