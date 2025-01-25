// src/app.ts
import dotenv from "dotenv";

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
    rolling: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      domain: process.env.NODE_ENV === "production" ? ".shifraz.me" : undefined,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Routes
app.use("/auth", authRoute);
app.use("/reports", reportsRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export default app;
