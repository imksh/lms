import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true }, // Instructions/description
  points: { type: Number, default: 10 },
  submissionType: {
    type: String,
    enum: ["playground", "text", "file"],
    default: "text",
  },
  defaultCode: { type: String, default: "" }, // Playground default code for the task
  language: { type: String, default: "javascript" }, // Programming language for playground
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  content: { type: String, required: true }, // Paragraph rich text content
  task: { type: taskSchema, default: null }, // Optional task associated with this section
});

const topicSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subjectKey: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    topicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      default: "Beginner",
    },
    duration: {
      type: String,
      default: "10 mins",
    },
    playgroundCode: {
      type: String,
      default: "",
    },
    quiz: {
      type: [quizQuestionSchema],
      default: [],
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    playgroundEnabled: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index on subjectKey and order to sort topics easily
topicSchema.index({ subjectKey: 1, order: 1 });

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
