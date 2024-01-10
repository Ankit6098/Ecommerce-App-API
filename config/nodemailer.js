const nodeMailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

// transporter is an object which will contain the information about the smtp server
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

// renderTemplate is a function which will render the html template
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  console.log(
    "relative path",
    path.join(__dirname, "../views/mailers", relativePath)
  );
  ejs.renderFile(
    console.log("nodemailer template data"),
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("Error in rendering template", err);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
