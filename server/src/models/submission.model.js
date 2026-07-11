import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicId: {
      type: String,
      required: true,
      trim: true,
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
    submissionType: {
      type: String,
      enum: ["playground", "text", "file"],
      required: true,
    },
    submittedContent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    grade: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index so a user only has one active submission per task (topicId + sectionIndex)
submissionSchema.index({ user: 1, topicId: 1, sectionIndex: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
