module.exports = (error, request, response) => {
  console.log('NOT FOUND');
  response.status(404).end();
};