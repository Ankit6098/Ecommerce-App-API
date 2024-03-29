const express = require('express');
const app = express();
const port = 8000;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true , methods: ['GET', 'POST', 'PUT', 'DELETE']}));

const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');

// use express json
app.use(express.json());

// use express urlencoded to parse form data
app.use(express.urlencoded());

// set up passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require("./config/passport-google-oauth-strategy");
const passportGithub = require("./config/passport-github2-strategy");

// set up session cookies
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    name: 'EcommerceApp',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.mongoDbUrl,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// set up local strategy to authenticate
app.use(passportLocal.setAuthenticatedUser);

// flash 
app.use(flash());

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});