const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('index', {
    title: 'index'
  });
});

router.get('/login', async (req, res) => {
  res.render('login', {
    title: 'login'
  });
});

module.exports = router;
