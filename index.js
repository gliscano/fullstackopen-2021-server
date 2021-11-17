require('dotenv').config();
require('./mongo');

const Note = require('./models/Note');
const express = require('express');
const logger = require('./loggerMiddleware');
const cors = require('cors');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// let notes = [];

app.get('/', (request, response) => {
  response.send('<h1>Hello Word!!!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
      // mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
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

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;

  Note.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch((err) => next(err));
});

app.post('/api/notes/', (request, response) => {
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

  newNote.save()
    .then((savedNote) => {
      response.status(201).json(savedNote);
    });
});

app.use(notFound);
app.use(handleErrors);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
