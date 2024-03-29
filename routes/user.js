const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const passport = require("../config/passport-local-strategy");

router.post("/register-user", usersController.registerUser);
router.post(
  "/create-session",
  passport.authenticate("local", { successRedirect: "http://localhost:5173/", failureRedirect: "http://localhost:5173/login" }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/oauth2callback",
  passport.authenticate("google", { successRedirect: "http://localhost:5173/", failureRedirect: "http://localhost:5173/login" }),
  usersController.createSession
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  usersController.createSession
);

router.get("/get-user", usersController.getUser);

module.exports = router;
