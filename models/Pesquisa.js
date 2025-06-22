const mongoose = require('mongoose');

const pesquisaSchema = new mongoose.Schema({
  termo: { type: String, required: true },
  resultados: { type: Object, required: true }, // Guarda o resultado das APIs — podes adaptar conforme precisares
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pesquisa', pesquisaSchema);
