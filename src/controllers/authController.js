const express = require('express');

const User = require('../models/user')
const router = express.Router();

//req são os dados da requisição ex: parametros, tokens...
//res é a resposta enviada para o usuario
router.post('/register', async (req, res) => {
   try{
      const user = await User.create(req.body);

      return res.send({ user });
   } catch (err) {
      return res.status(400).send({ error: 'Registration failed' })
   }

});

module.exports = app => app.use('/auth', router);
