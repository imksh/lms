import mongoose from "mongoose";

const metaSchema = new mongoose.Schema(
  {
    lmsTitle: {
      type: String,
      default: "LMS Platform",
    },
    lmsTagline: {
      type: String,
      default: "Learn, Build, Ship.",
    },
    lmsLogo: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#6366f1",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    footerText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Meta = mongoose.model("Meta", metaSchema);
export default Meta;
