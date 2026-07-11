import Note from "../models/note.model.js";

export const getNotesByUser = async (userId) => {
  return await Note.find({ user: userId });
};

export const saveNote = async (userId, topicId, content) => {
  const note = await Note.findOneAndUpdate(
    { user: userId, topicId },
    { content },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return note;
};
