import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index for user + topic
noteSchema.index({ user: 1, topicId: 1 }, { unique: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
