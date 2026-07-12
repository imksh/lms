import mongoose from "mongoose";
import Topic from "./src/models/topic.model.js";

mongoose.connect("mongodb://localhost:27017/lms")
  .then(async () => {
    try {
      const topic = await Topic.findOne();
      if (!topic) {
        console.log("No topic found");
        process.exit(0);
      }
      console.log("Found topic:", topic.title);
      topic.quiz = [
        {
          question: "Test Question",
          options: ["A", "B"],
          correctAnswerIndex: 0
        }
      ];
      await topic.save();
      console.log("Successfully saved quiz!");
    } catch (e) {
      console.error("Error saving:", e);
    }
    process.exit(0);
  });
