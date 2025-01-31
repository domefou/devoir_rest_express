const express = require('express');
const router = express.Router();


const service = require('../services/users');



  
router.get('/signup', function(req, res, next) {
    res.render('signup');
  });


router.post('/login', service.authenticate, async (req, res, next) =>{
  res.redirect('adminusers',{
    title: 'adminusers'
  })
});

router.get('/adminusers', function(req, res, next){
 res.render('adminusers')
})



module.exports = router;