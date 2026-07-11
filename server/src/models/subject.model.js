import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "BookOpen",
    },
    desc: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
    isPublic: {
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

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
