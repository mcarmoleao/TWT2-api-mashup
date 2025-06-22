const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const isAuthenticated = require('../middleware/authMiddleware');
const Pesquisa = require('../models/Pesquisa');

// GET /pesquisa?q=nome  (faz mashup e guarda pesquisa)
router.get('/', isAuthenticated, async (req, res) => {
  const termo = req.query.q;
  const userId = req.session.user._id;

  if (!termo) {
    return res.status(400).json({ message: 'Termo de pesquisa em falta' });
  }

  try {
    // Wikipedia
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`);
    const wikiData = await wikiRes.json();

    if (wikiData.title === "Not found.") {
      return res.status(404).json({ message: 'Artista não encontrado na Wikipedia' });
    }

    // Unsplash
    const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(termo)}&per_page=5&client_id=${process.env.UNSPLASH_KEY}`);
    const unsplashData = await unsplashRes.json();
    const imagens = unsplashData.results.map(img => img.urls.regular);

    // Montar o objeto resultados para guardar
    const resultados = {
      artista: wikiData.title,
      bio: wikiData.extract,
      imagem_wikipedia: wikiData.thumbnail?.source || null,
      imagens_unsplash: imagens
    };

    // Guardar pesquisa no MongoDB
    const novaPesquisa = new Pesquisa({
      termo,
      resultados,
      userId
    });
    await novaPesquisa.save();

    // Enviar resultados ao frontend
    res.json(resultados);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no mashup', erro: err.message });
  }
});

// GET /pesquisa/historico  (listar histórico do utilizador)
router.get('/historico', isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;

  try {
    const historico = await Pesquisa.find({ userId }).sort({ createdAt: -1 });
    res.json(historico);
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
