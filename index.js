require('dotenv').config();
require('./mongo');

const Note = require('./models/Note');
const express = require('express');
const logger = require('./loggerMiddleware');
const cors = require('cors');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const { isValidObjectId, SchemaTypes } = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// let notes = [];

app.get('/', (request, response) => {
  response.send('<h1>Hello Word!!!</h1>');
});

/* app.get('/api/notes', (request, response) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
      // mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
}); */

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

app.get('/api/notes/:id', (request, response, next) => {
  let { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important || false,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => response.json(result))
    .catch((err) => {
      console.log('Error update');
      next(err);
    });
});

app.post('/api/notes/', async (request, response, next) => {
  const note = request.body;

  if ( !note || !note.content ) {
    return response.status(400).json({
      error: 'note.content is missing'
    });
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString()
  });

  // newNote.save()
  //   .then((savedNote) => {
  //     response.status(201).json(savedNote);
  //   });

  try {
    const saveNote = await newNote.save();
    response.status(201).json(saveNote); 
  } catch (error) {
    next(error);
  }
});

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params;

  if (!isValidObjectId(id)) {
    return response.status(400).json({
      error: 'noteId is not valid'
    });
  }

  try {
    await Note.findByIdAndDelete(id);
    response.status(204).end(); 
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.use(notFound);
app.use(handleErrors);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };