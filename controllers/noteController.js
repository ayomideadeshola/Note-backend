const noteService = require("../services/noteService");

exports.createNote = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const note = await noteService.createNote({ title, content, tags });

        console.log(`Note created successfully`);

        return res.status(201).json({
            message: "Note created successfully",
            note
        });
    } catch (err) {
        next(err);
    }
};


exports.getNotes = async (req, res, next) => {
    try {
        const tag = req.query.tag;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const notes = await noteService.getNotes({ tag, page, limit });
        res.json(notes);
    } catch (err) {
        next(err);
    }
};

exports.getNote = async (req, res, next) => {
    try {
        const note = await noteService.getNoteById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        next(err);
    }
};

exports.updateNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (title === "" || content === "") {
            return res.status(400).json({ message: "Title/content cannot be empty" });
        }

        const updated = await noteService.updateNote(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Note not found" });
        }

        console.log(`Note updated successfully`);

        res.json({
            message: "Note updated successfully",
            note: updated
        });

    } catch (err) {
        next(err);
    }
};


exports.deleteNote = async (req, res, next) => {
  try {
    const deleted = await noteService.deleteNote(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    console.log("Note deleted successfully:");

    return res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};
