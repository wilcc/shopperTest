const express = require('express');
const router = express.Router();
const User = require('./models/User');
const userValidation = require('./utils/userValidation');
const {
  register,
  updateProfile,
  updatePassword,
} = require('./controllers/userController');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const loginValidation = require('./utils/loginValidation')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('main/home');
});

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

router.get('/register', isAuth, (req, res) => {
  return res.render('auth/register');
});

router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('auth/profile');
  }
  return res.send('Unauthorized');
});
router.get('/update-profile', (req, res) => {
  return res.render('auth/update-profile');
});
// router.put('/update-profile', (req, res, next) => {
//   return new Promise((resolve, reject) => {
//     User.findById({ _id: req.user._id })
//       .then((user) => {
//         const {
//           email,
//           address,
//         } = req.body;
//         if (req.body.name) user.profile.name = req.body.name;
//         if (email) user.email = email;
//         if (address) user.address = address;
//         return user;
//       })
//       .then((user) => {
//         user
//           .save()
//           .then((user) => {
//             return res.json({ user });
//             // resolve(user)
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// });
router.put('/update-profile', (req, res, next) => {
  updateProfile(req.body, req.user._id)
    .then(() => {
      return res.redirect(301, '/api/users/profile');
    })
    .catch((err) => {
      next(err);
    });
});
const checkPassword = [
  check('newPassword', 'Please Include a valid password').isLength({ min: 6 }),
];

router.put('/update-password', checkPassword, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    updatePassword(req.body, req.user._id)
      .then(() => {
        return res.redirect('/api/users/profile')
        // return res.send('Updated <a href="/logout">Logout</a>');
      })
      .catch((err) => {
        console.log(err);
        req.flash('perrors', 'Unable to Update User');
        return res.redirect('/api/users/update-profile');
      });
  } catch (errors) {
    console.log(errors);
  }
});
router.post('/register', userValidation, register);
// router.post('/register', (req,res,next)=>{
//   User.findOne({email:req.body.email}).then((user)=>{
//     if(user){
//       return res.status(401).json({msg:'User Already Exists'})
//     }else{
//       const user = new User()
//       user.profile.name = req.body.name
//       user.email = req.body.email
//       user.password = req.body.password

//       user.save((err)=>{
//         if(err) return next(err)
//         return res.status(200).json({message: 'success', user})
//       })
//     }
//   })
// })

router.get('/login', isAuth, (req, res) => {
  return res.render('auth/login');
});

router.post(
  '/login',loginValidation,function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
    req.flash('errors', errors.errors[0].msg)
    return res.redirect('/api/users/login')
  }else{
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/api/users/login',
      failureFlash: true,
    })

  }


  }
);
module.exports = router;
