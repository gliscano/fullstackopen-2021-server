const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.post('/', async(request, response) => {
  const { body } = request;
  const { username, name, password } = body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const userSave = await user.save();
  response.json(userSave);
});

module.exports = usersRouter;