const express = require('express');
const router = express.Router();
const private = require('../../../middlewares/private');

const serviceUsers = require('../../../services/users');
const Users = require('../../../models/users');


router.get('/user', private.checkJWT, async (req, res) => {
  try {
    const users = await Users.find({});
    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;

    res.render('adminUser', { 
      users: users,
      findUsers: null,
      user: req.decoded.user,
      successMessage: successMessage,
      errorMessage: errorMessage  });
    
} catch (error) {
  return res.status(501).json({ message: "GET serveur introuvable" , error });
}
});




router.get('/user/:name', private.checkJWT, async (req, res) => {

  const name = req.params.name
  try {
    const users = await Users.find({});
    const findUsers = await Users.findOne({ name: name})

    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;


    res.render('adminUser', { 
      users: users,
      findUsers: findUsers,
      user: req.decoded.user,
      successMessage: successMessage,
      errorMessage: errorMessage  });
    
} catch (error) {
  return res.status(501).json({ message: "GET serveur introuvable" , error });
}
});

router.post('/user/find',private.checkJWT, async (req, res, next) => {
  try {
    await serviceUsers.getById(req, res);
    console.log('utilisateur trouvé');
  } catch (error) {
    console.error('METHOD POST add = erreur lors de l\'utilisation de la méthode', error);
  }
});



router.post('/user/delete',private.checkJWT, async (req, res) => {
  try{
    await serviceUsers.userDelete(req, res);

  } catch(error){
    return res.status(501).json({ message: "METHOD DELETE userDelete serveur introuvable" , error });
  }

});




router.post('/user/add', private.checkJWT, async (req, res, next) => {
  
  const email = req.body.email;
  const user = await Users.findOne({ email: email})

  try {
    if(user){
      await serviceUsers.adminDecryptUpdate(req, res);
    }
    else{
      await serviceUsers.adminAdd(req, res);
    }
    
  } catch (error) {
      if (!res.headersSent) {
          return res.status(501).json({ message: "POST/PUT serveur introuvable" , error });
      }
  }
});

module.exports = router;