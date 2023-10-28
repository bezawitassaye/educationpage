const passport = require('passport');
const User = require('../model/user');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  'local.signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function(req, email, password, done) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map(error => error.msg);
        return done(null, false, req.flash('error', messages));
      }
      try {
        const user = await User.findOne({ email: email }).exec();
        if (user) {
          return done(null, false, { message: 'Email is already in use' });
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'local.signin',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function(req, email, password, done) {
      check('email', 'Invalid email').notEmpty().isEmail().run(req);
      check('password', 'Invalid password').notEmpty().run(req);
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        var messages = errors.array().map(error => error.msg);
        return done(null, false, req.flash('error', messages));
      }

      try {
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          return done(null, false, { message: 'No user found' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Wrong password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;