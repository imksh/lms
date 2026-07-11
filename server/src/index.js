import app from "./app.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 4500;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
