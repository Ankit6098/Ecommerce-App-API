const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      // find a user and establish the identity
      const user = await User.findOne({ email: email });

      if (!user) {
        console.log("Invalid email/Password");
        req.flash("erorr", "Invalid email/Password");
        return done(null, false);
      }

      // Load hash from database for the password.
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          // This will be either true or false, based on if the string
          // matches or not.
          if (result) {
            return done(null, user);
          }
          console.log("Invalid username/password");
          return done(null, false);
        })
        .catch((error) => {
          console.log("Error in hashing password");
          return;
        });
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);

    if (!user) {
      req.flash("alert", "User not found");
      throw new Error("User not found");
    }

    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return done(err);
  }
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
