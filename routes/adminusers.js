const express = require('express');
const router = express.Router();


router.get('/adminusers', async (req, res) =>{
  res.render('adminusers', {
    title: 'adminusers'
  })
});


module.exports = router;