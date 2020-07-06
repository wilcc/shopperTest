const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../routes/Users/models/User');
const {validationResult } = require('express-validator');
const loginValidation = require('../routes/Users/utils/loginValidation');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  await User.findById(id, (err, user) => {
    done(err, user);
  });
});

const authenticatePassword = async (inputPassword, user, done, req) => {
  const exists = await bcrypt.compare(inputPassword, user.password);
  try {
    if (!exists) {
      console.log('Invalid Log');
      return done(null, false, req.flash('errors', 'Check email or password'));
    }
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
};

const verifyCallback = async (req, email, password, done) => {
  await User.findOne({ email }, (err, user) => {
    try {
      // if(err) return done(err,null)
      if (!user) {
        console.log('No user has been found');
        return done(null, false, req.flash('errors', 'No user has been found'));
      }
      authenticatePassword(password, user, done, req);
    } catch (error) {
      done(error, null);
    }
  });
};
passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    verifyCallback,
  )
);
