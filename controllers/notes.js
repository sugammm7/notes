const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});

  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).end();
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
});

notesRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    const note = new Note({
      content: body.content,
      important: body.important || false,
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Note.findByIdAndDelete(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
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
