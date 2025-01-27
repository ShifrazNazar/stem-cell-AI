"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    console.log("User authenticated: ", req.user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});
router.get("/current-user", (req, res) => {
    console.log("Session:", req.session);
    console.log("Session ID:", req.sessionID);
    console.log("Cookies:", req.cookies);
    console.log("User:", req.user);
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User Agent:", req.get("User-Agent"));
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
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
exports.default = router;
