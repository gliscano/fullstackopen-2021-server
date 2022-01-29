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

  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }

});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

describe('Get all notes', () => {
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
});

describe('POST notes', () => {
  test('add a new note with content', async () => {
    const newNote = {
      content: 'New note 2 from test',
      important: true,
    };
  
    await api.post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const response = await api.get('/api/notes');
    const contents = response.body.map((note) => note.content);
  
    expect(contents).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
  });
  
  test('a new note without content is not added', async () => {
    const newNote = {
      important: true,
    };
  
    await api.post('/api/notes')
      .send(newNote)
      .expect(400);
    const response = await api.get('/api/notes');
    const contents = response.body.map((note) => note.content);
  
    expect(contents).toHaveLength(initialNotes.length);
  });
});

describe ('DELETE notes', () => {
  test('a note can be deleted', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map((note) => note);
    const noteToDelete = contents[0];
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);
  
    const responseNotes = await api.get('/api/notes');
    const notes = responseNotes.body.map((note) => note.content);
  
    expect(notes).toHaveLength(initialNotes.length - 1);
    expect(notes).not.toContain(initialNotes[0].content);
  });
  
  test('a note with incorrect ID can not be deleted', async () => {
    await api
      .delete('/api/notes/123456789')
      .expect(400);
  
    const responseNotes = await api.get('/api/notes');
    const notes = responseNotes.body.map((note) => note.content);
  
    expect(notes).toHaveLength(initialNotes.length);
  });
});