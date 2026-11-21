import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const { tag, search } = req.query;

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const [notes, totalNotes] = await Promise.all([
    Note.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages: Math.ceil(totalNotes / perPage),
    notes,
  });
};
export const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
