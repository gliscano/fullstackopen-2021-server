const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../index');
const Note = require('../models/Note');
const api = supertest(app);

const initialNotes = [
  {
    'content': 'New Note 1 From Test',
    'important': true,
    'date': new Date()
  },
  {
    'content': 'New Note 2 From Test',
    'important': true,
    'date': new Date()
  }
];

beforeEach(async () => {
  await Note.deleteMany({});
  const note1 = new Note(initialNotes[0]);
  await note1.save();

  const note2 = new Note(initialNotes[1]);
  await note2.save();
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test(`there are ${initialNotes.length} notes`, async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
});

test('content of note', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map((note) => note.content);

  expect(contents).toContain('New Note 1 From Test');
});