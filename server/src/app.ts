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

// routes
import authRoute from "./routes/auth";
import reportsRoute from "./routes/reports";
import paymentsRoute from "./routes/payments";
import { handleWebhook } from "./controllers/payment.controller";

const app = express();
app.set("trust proxy", 1);
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add this
    allowedHeaders: ["Content-Type", "Authorization"], // Add this
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(morgan("dev"));

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // This is correct
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // This is correct
      maxAge: 24 * 60 * 60 * 1000,
      domain:
        process.env.NODE_ENV === "production" ? ".vercel.app" : "localhost", // Add this
    },
    proxy: process.env.NODE_ENV === "production", // Add this for secure cookies behind proxy
  })
);

app.use(passport.initialize());
app.use(passport.session());

// root
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});
app.use("/auth", authRoute);
app.use("/reports", reportsRoute);
app.use("/payments", paymentsRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export default app;
