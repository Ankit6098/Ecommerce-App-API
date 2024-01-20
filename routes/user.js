const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const passport = require("../config/passport-local-strategy");

router.post("/register-user", usersController.regiter);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/" }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/oauth2callback",
  passport.authenticate("google", { failureRedirect: "/" }),
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

module.exports = router;
