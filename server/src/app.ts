import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import pollRoutes from "./routes/pollRoutes";
import * as cookieParser from "cookie-parser";
// import { authMiddleware } from './middlewares/authMiddleware';

const app = express();

app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
// app.use(authMiddleware); // Apply authentication middleware to all routes

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/poll", pollRoutes);

export default app;
