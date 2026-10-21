const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }

      res.json(note);
    })
    .catch((err) => next(err));
});

notesRouter.post('/', (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((err) => next(err));
});

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((savedNote) => {
        res.json(savedNote);
      });
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
