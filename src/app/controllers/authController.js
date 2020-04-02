const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth');
const User = require('../models/user');
const router = express.Router();
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

function generateToken(params = {}) {
   return jwt.sign(params, authConfig.secret, {
      expiresIn: 86400,
   });
}

//req são os dados da requisição ex: parametros, tokens...
//res é a resposta enviada para o usuario

//cadastro de usuario
router.post('/register', async (req, res) => {
   const { email } = req.body;

   try {
      if (await User.findOne({ email }))
         return res.status(400).send({ error: 'User already exists' });

      const user = await User.create(req.body);

      user.password = undefined;

      return res.status(201).send({
         user,
         token: generateToken({ id: user.id })
      });
   } catch (err) {
      console.log(err);

      return res.status(400).send({ error: 'Registration failed' })
   }

});

// login
router.post('/login', async (req, res) => {

   const { email, password } = req.body;

   const user = await User.findOne({ email }).select('+password');

   if (!user)
      return res.status(400).send({ error: 'User not found' });

   if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: "Invalid password" });

   user.password = undefined;


   return res.send({
      user,
      token: generateToken({ id: user.id })
   });
});


router.post('/forgot_password', async (req, res) => {
   const { email } = req.body;

   console.log(email);

   try {
      const user = await User.findOne({ email });

      if (!user)
         return res.status(400).send({ error: 'User not found' });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
         '$set': {
            passwordResetToken: token,
            passwordResetExpires: now,
         }
      });

      mailer.sendMail({
         to: email,
         from: 'jonathancardoso2@edu.unifor.br',
         template: 'auth/forgot_password',
         context: { token }
      }, (err) => {
         Console.log(OLAAAAAAAA)
         if(err)
            return res.status(400).send({ error: 'Cannot send forgot password email!' });


         return res.status(200).send({ resp: 'Sent with success' });
      });

      return res.status(200).send({ resp: 'Sent with success' });
   } catch (err) {
      console.log(err);
      res.status(400).send({ error: 'Erro on forgot password, try again' });
   }

   
});


router.post('/reset_password', async (req, res) => {
   const { email, token, password } = req.body

   try {
      const user = await User.findOne({ email })
         .select('+passwordResetToken passwordResetExpires');

      if(!user)
         return res.status(400).send({ error: 'User not found' });
         
      if( token !== user.passwordResetToken)
         return res.status(400).send({ error: 'Token invalid' });
         
      const now = new Date();


      if(now > user.passwordResetExpires)
         return res.status(400).send({ error: 'Token expired, genereted new one' })

      user.password = password;

      await user.save();

      return res.send();
   } catch (error) {
      return res.status(400).send({ error: 'Cannot reset password, try again' });
   }

});

module.exports = app => app.use('/auth', router);
