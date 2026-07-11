import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

const Module = mongoose.model("Module", moduleSchema);
export default Module;
