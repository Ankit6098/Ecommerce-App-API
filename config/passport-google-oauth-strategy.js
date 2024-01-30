const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const signupMailer = require("../mailers/signup_mailer");
const env = require("./environment");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email", "https://www.googleapis.com/auth/user.addresses.read", "https://www.googleapis.com/auth/user.phonenumbers.read"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // if found, set this user as req.user
        return done(null, user);
      } else {
        // if not found, create the user and set it as req.user
        const newUser = await User.create({
          avatar: profile.photos[0].value,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
          address: profile._json.addresses,
          phoneNumbers: profile._json.phoneNumbers,
        });
        signupMailer.signupWelcome(newUser);
        return done(null, newUser);
      }
    }
  )
);

// serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserialize the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }
    return done(null, user);
  });
});
