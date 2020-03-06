//pegar conexão do banco de dados 
const mongoose = require('../database');
//serve para criptografia
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
      type: String,
      require: true,
  },
  email: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
  },
  password: {
      type: String,
      require: true,
      select: false,
  },
  cratedAt: {
      type: Date,
      default: Date.now,
  }
});

//criptografar password
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
