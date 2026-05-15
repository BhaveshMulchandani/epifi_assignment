const mongoose = require('mongoose');
const Note = require('../models/Note');
const User = require('../models/User');

const buildAccessFilter = (userId, archivedFilter) => {
  const baseFilter = {
    archived: archivedFilter,
    $or: [{ owner: userId }, { sharedWith: userId }],
  };
  return baseFilter;
};

exports.getNotes = async (req, res) => {
  const { page = 1, limit = 10, archived } = req.query;
  const archivedFilter = archived === 'true';
  const filter = buildAccessFilter(req.user._id, archivedFilter);

  const pageNumber = Math.max(1, parseInt(page, 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate('owner', 'email')
      .populate('sharedWith', 'email'),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({ notes, page: pageNumber, limit: pageSize, total });
};

exports.getNoteById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id).populate('owner', 'email').populate('sharedWith', 'email');
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const isOwner = note.owner._id.equals(req.user._id);
  const isShared = note.sharedWith.some((user) => user._id.equals(req.user._id));

  if (!isOwner && !isShared) {
    return res.status(403).json({ message: 'Access denied to this note' });
  }

  res.status(200).json(note);
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const createdNote = await Note.create({
    title,
    content,
    owner: req.user._id,
  });

  const note = await Note.findById(createdNote._id)
    .populate('owner', 'email')
    .populate('sharedWith', 'email');

  res.status(201).json(note);
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the owner can update this note' });
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;

  await note.save();

  const updatedNote = await Note.findById(id)
    .populate('owner', 'email')
    .populate('sharedWith', 'email');

  res.status(200).json(updatedNote);
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the owner can delete this note' });
  }

  await note.deleteOne();
  res.status(204).send();
};

exports.shareNote = async (req, res) => {
  const { id } = req.params;
  const { share_with_email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the owner can share this note' });
  }

  const targetUser = await User.findOne({ email: share_with_email.toLowerCase() });
  if (!targetUser) {
    return res.status(404).json({ message: 'Target user not found' });
  }

  if (targetUser._id.equals(req.user._id)) {
    return res.status(400).json({ message: 'Cannot share note with yourself' });
  }

  if (note.sharedWith.some((id) => id.equals(targetUser._id))) {
    return res.status(400).json({ message: 'Note already shared with this user' });
  }

  note.sharedWith.push(targetUser._id);
  await note.save();

  res.status(200).json({ message: 'Note shared successfully' });
};

exports.searchNotes = async (req, res) => {
  const { q = '', page = 1, limit = 10 } = req.query;
  const searchQuery = q.trim();

  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const pageNumber = Math.max(1, parseInt(page, 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const regex = new RegExp(searchQuery, 'i');

  const filter = {
    archived: false,
    $and: [
      { $or: [{ owner: req.user._id }, { sharedWith: req.user._id }] },
      { $or: [{ title: regex }, { content: regex }] },
    ],
  };

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate('owner', 'email')
      .populate('sharedWith', 'email'),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({ notes, page: pageNumber, limit: pageSize, total });
};

exports.archiveNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the owner can archive this note' });
  }

  note.archived = true;
  await note.save();

  res.status(200).json({ message: 'Note archived successfully' });
};

exports.unarchiveNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the owner can unarchive this note' });
  }

  note.archived = false;
  await note.save();

  res.status(200).json({ message: 'Note unarchived successfully' });
};
