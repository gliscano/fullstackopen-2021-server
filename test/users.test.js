const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { mongoose } = require('mongoose');
const User = require('../models/User');
const { app, server } = require('../index');
const api = supertest(app);

describe('creating a new user', () => {
  beforeEach(async() => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('1A2B3C4D', 10);
    const user = new User({
      username: 'userTest',
      name: 'testing',
      passwordHash
    });

    await user.save();
  });

  test('works as expected creating a username', async () => {
    const usersDB = await User.find({});
    const userAtStart = usersDB.map(user => user.toJSON());

    const newUser = {
      username: 'userTest2',
      name: 'testing 2',
      password: 'userTest2#'
    };


    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersDBAfter = User.find({});
    const userAtEnd = usersDBAfter.map(user => user.toJSON());
    const usernames = userAtEnd.map(u => u.username);

    expect(userAtEnd).toHaveLength(userAtStart.length + 1);
    expect(usernames).toContain(newUser.username);

  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
});