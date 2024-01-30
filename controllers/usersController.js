const User = require("../models/user");
const bcrypt = require("bcrypt");
const signupMailer = require("../mailers/signup_mailer");

module.exports.registerUser = async function (req, res) {
  console.log(req.body);
  // check if password and confirm_password are same
  if (req.body.password != req.body.confirmPassword) {
    console.log("password and confirm_password are not same");
    req.flash("error", "Password and Confirm Password are not same");
    res.status(400).send("Password and Confirm Password are not same");
  }

  // check if user already exists
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const plaintextPassword = req.body.password;
    const saltRounds = 10;

    // Generate a hash of the password
    bcrypt.hash(plaintextPassword, saltRounds, async (err, hash) => {
      if (err) {
        console.error(err);
        req.flash("error", "Error Creating User");
        return res.status(500).send("Error creating user");
      }

      try {
        const newUser = await User.create({
          ...req.body,
          password: hash, // Store the hashed password in the database
        });
        console.log("New user created!");
        req.flash("success", "New User Created");
        signupMailer.signupWelcome(newUser);
        res.status(201).send('User registered successfully');
      } catch (err) {
        console.error(err);
        req.flash("error", "Error Creating User");
        return res.status(500).send("Error creating user");
      }
    });
  } else {
    console.log("User already exists!");
    req.flash("info", "User already exists!");
    res.status(400).send("User already exists!");
  }
};

module.exports.createSession = function (req, res) {
  if (req.isAuthenticated()) {
    req.flash("success", "Logged in Successfully");
    // send json response
    return res.status(200).send("Logged in Successfully");
  }
  req.flash("error", "Invalid Username/Password");
  // send json response
  return res.status(401).send("Invalid Username/Password");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (error) {
    req.session.destroy();
    if (error) {
      req.flash("error", "Something went wrong!");
      // send json response
      return res.status(500).send("Something went wrong!");
    }
  });
  req.flash("success", "Successfully logged out");
  // send json response
  return res.status(200).send("Successfully logged out");
};

module.exports.getUser = async function (req, res) {
  if (req.user) {
    console.log("User found!");
    // send json response
    return res.status(200).json(req.user);
  } else {
    console.log("User not found!");
    // send json response
    return res.status(404).send("User not found!");
  }
}