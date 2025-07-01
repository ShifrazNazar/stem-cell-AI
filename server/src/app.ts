// src/app.ts
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/passport";

// Routes
import authRoute from "./routes/auth";
import reportsRoute from "./routes/reports";

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === "production" ? ".vercel.app" : ".vercel.app",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Root Route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello, world!");
});

// Routes
app.use("/auth", authRoute);
app.use("/reports", reportsRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export default app;
