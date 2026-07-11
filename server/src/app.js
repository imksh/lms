import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// CORS — allow cookies from the frontend dev/prod origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true, // required for cookies to be sent cross-origin
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (required to read req.cookies)
app.use(cookieParser(process.env.COOKIE_SECRET));

// Apply general rate limiter to all /api routes
app.use("/api", apiLimiter);

// Welcome root route
app.get("/", (req, res) => {
  res.json({ message: "LMS API Server is running" });
});

// API Routes
app.use("/api", apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
