const Note = require("../models/Note");

exports.createNote = (data) => Note.create(data);

exports.getNotes = ({ tag, page = 1, limit = 20 }) => {
    const filter = tag ? { tags: tag } : {};
    const skip = (page - 1) * limit;
    return Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

exports.getNoteById = (id) => Note.findById(id);

exports.updateNote = (id, data) => Note.findByIdAndUpdate(id, data, { new: true, runValidators: true });

exports.deleteNote = (id) => Note.findByIdAndDelete(id);
