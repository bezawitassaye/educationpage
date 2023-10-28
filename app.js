require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const body_parser = require('body-parser');
const crypto = require('crypto');

const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log(sessionSecret);
const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
connectDB();
require('./server/config/passport');

const PORT = process.env.PORT || 5591;

// ...

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(body_parser.json());

app.use(cookieParser());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 180601000 },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);

app.set('layout', 'layouts/main');

app.set('view engine', 'ejs');

app.use(function (req, res, next) {
  // Initialize session.cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = {};
  }

  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// Routes
const mainRoutes = require('./server/routes/main');
app.use('/', mainRoutes);

const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection middleware after session middleware
app.use(csrfProtection);

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // Handle CSRF token errors here
  res.status(403).send('CSRF token invalid');
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});