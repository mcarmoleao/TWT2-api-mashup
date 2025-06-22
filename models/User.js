const mongoose = require('mongoose');

const historicoSchema = new mongoose.Schema({
  termo: String,
  data: Date
});

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  historico: [{
    termo: String,
    data: Date
  }]
});

module.exports = mongoose.model('User', userSchema);
