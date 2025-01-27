// src/routes/auth.ts
import express from "express";
import passport from "passport";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    console.log("User authenticated: ", req.user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

router.get("/current-user", (req: Request, res: Response) => {
  console.log("Session:", req.session);
  console.log("Session ID:", req.sessionID);
  console.log("Cookies:", req.cookies);
  console.log("User:", req.user);
  console.log("Authenticated:", req.isAuthenticated());
  console.log("User Agent:", req.get("User-Agent"));
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ status: "ok" });
  });
});

export default router;
