const jwt = require('jsonwebtoken');
const notesRouter = require('express').Router();

const Note = require('../models/note');
const User = require('../models/user');

const config = require('../utils/config');

const getTokenFrom = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer')) {
    return auth.split(' ')[1];
  }
  return null;
};

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  });

  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const note = await Note.findById(id).populate('user', {
    username: 1,
    name: 1,
  });
  if (!note) {
    return res.status(404).end();
  }

  res.json(note);
});

notesRouter.post('/', async (req, res) => {
  const body = req.body;

  const decoded = jwt.verify(getTokenFrom(req), config.SECRET);
  if (!decoded.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({ error: 'user associated with token not found' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await note.save();

  user.notes = user.notes.concat(savedNote._id);
  user.save();

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
