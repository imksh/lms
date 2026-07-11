import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
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
    questionIndex: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness per question per user
answerSchema.index({ user: 1, topicId: 1, questionIndex: 1 }, { unique: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
