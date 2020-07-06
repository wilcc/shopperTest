const {check} =require('express-validator')

const checkCategory = [
    check('name', 'Category is required').not().isEmpty(),
  ]

module.exports = checkCategory