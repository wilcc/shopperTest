
const { check } = require('express-validator');


const userValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter email').isEmail(),
    check('password', 'Please include a valid password').isLength({min:6})
  ];

  module.exports = userValidation