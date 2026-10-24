const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});

  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).end();
  }

  res.json(note);
});

notesRouter.post('/', async (req, res) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();

  res.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;

  await Note.findByIdAndDelete(id);

  res.status(204).end();
});

notesRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { content, important } = req.body;

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).end();
  }

  note.content = content;
  note.important = important;

  const updatedNote = await note.save();

  res.json(updatedNote);
});

module.exports = notesRouter;
