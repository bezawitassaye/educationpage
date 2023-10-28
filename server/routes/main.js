const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const Post = require('../model/post');
const user = require('../model/courses');
const Cart = require('../model/cart');
const csrf = require('csurf');
const csrfProtection = csrf();

// Initialize Passport middleware
router.use(passport.initialize());
router.use(passport.session());

// Define the local signup strategy
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async function (req, email, password, done) {
  try {
    const newUser = new User({
      email: email,
      password: password,
      // Add other user properties here
    });

    const savedUser = await newUser.save();
    return done(null, savedUser);
  } catch (error) {
    return done(error);
  }
}));

router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('user/profile');
});

router.get('/add-to-cart/:id', async function(req, res, next) {
  try {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    const product = await Post.findById(productId);
    if (!product) {
      return res.redirect('/');
    }

    cart.add(product, product._id);

    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/shopping', async (req, res) => {
  const locals = {
    title: "Your Cart"
  };
  if (!req.session.cart) {
    return res.render('shop/shopping', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping');
  }

  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', { total: cart.totalPrice });
});

router.get('/', async (req, res) => {
  const locals = {
    title: "Home Page",
    login: res.locals.login
  };
  try {
    const data = await Post.find();
    res.render('shop/index', { locals, data, csrfToken: req.csrfToken() });
  } catch (error) {
    console.log(error);
  }
});

router.get('/course', async (req, res) => {
  const locals = {
    title: "Home Page"
  };
  try {
    const data = await user.find();
    res.render('course', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

router.get('/signup', async (req, res) => {
  const locals = {
    title: "Home Page"
  };
  try {
    const data = await User.find();
    const messages = req.flash('error');
    res.render('user/signup', { locals, data, csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
  } catch (error) {
    console.log(error);
  }
});

router.get('/signin', async (req, res) => {
  const locals = {
    title: "Home Page"
  };
  try {
    const messages = req.flash('error');
    res.render('user/signin', { locals, csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
  } catch (error) {
    console.log(error);
  }
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signup');
}





async function insertPostData() {
try {
const existingData = await Post.findOne();
if (!existingData) {
await Post.insertMany([
{
name: "Mathematics",
image: "images/image1.jpg",
size: "8 modules",
price: 13,
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/imag2.jpg",
size: "8 modules",
price: 10,
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image3.jpg",
size: "8 modules",
price: 9,
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image4.webp",
size: "8 modules",
price: 12,
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image5.jpg",
size: "8 modules",
price: 7,
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image6.jpg",
size: "8 modules",
cost: 24,
addto: "Add to cart"
},
// Add other data entries here
]);
console.log('Data inserted successfully');
} else {
console.log('Data already exists');
}
} catch (error) {
console.log(error);
}
}

insertPostData();

async function insertPostDatauser() {
try {
const existingData = await user.findOne();
if (!existingData) {
await user.insertMany([
{
name: "Mathematics",
image: "images/image1.jpg",
size: "8 modules",
cost: "Br 13",
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/imag2.jpg",
size: "8 modules",
cost: "Br 10",
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image3.jpg",
size: "8 modules",
cost: "Br 9",
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image4.webp",
size: "8 modules",
cost: "Br 12",
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image5.jpg",
size: "8 modules",
cost: "Br 7",
addto: "Add to cart"
},
{
name: "Mathematics",
image: "images/image6.jpg",
size: "8 modules",
cost: "Br 24",
addto: "Add to cart"
},
// Add other data entries here
]);
console.log('Data inserted successfully');
} else {
console.log('Data already exists');
}
} catch (error) {
console.log(error);
}
}

insertPostDatauser();
module.exports = router;