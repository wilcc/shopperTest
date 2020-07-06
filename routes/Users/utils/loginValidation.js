const { check } = require('express-validator');

const loginValidation = [
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ]


  module.exports = loginValidation
