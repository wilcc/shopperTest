const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log(req.session)
  res.render('main/home')
});
router.get('/logout',(req,res)=>{
  req.logout()
  req.session.destroy()
  return res.redirect('/api/users/login')
})
module.exports = router;
