import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import pollRoutes from "./routes/pollRoutes";
import * as cookieParser from "cookie-parser";

const app = express();

const whitelist = [process.env.CLIENT_URL, "http://localhost:3000"];

app.use(json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/poll", pollRoutes);

export default app;
