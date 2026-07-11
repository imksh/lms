import * as noteService from "../services/note.service.js";

export const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotesByUser(req.user._id);
    return res.status(200).json(notes);
  } catch (error) {
    return next(error);
  }
};

export const saveNote = async (req, res, next) => {
  try {
    const { topicId, content } = req.body;
    if (!topicId || content === undefined) {
      return res.status(400).json({ message: "Please provide topicId and content" });
    }
    const note = await noteService.saveNote(req.user._id, topicId, content);
    return res.status(200).json(note);
  } catch (error) {
    return next(error);
  }
};
