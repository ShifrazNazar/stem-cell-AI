// src/routes/auth.ts
import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User authenticated: ", req.user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

router.get("/current-user", (req, res) => {
  console.log("Session: ", req.session);
  console.log("User: ", req.user);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("CLIENT_URL:", process.env.CLIENT_URL);
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ status: "ok" });
  });
});

export default router;
