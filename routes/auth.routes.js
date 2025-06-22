const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Rota de registo
router.post('/register', async (req, res) => {
  const { nome, email, username, password } = req.body;

  try {
    // Verifica se email ou username existem
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'Utilizador ou email já existem' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nome, email, username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'Utilizador registado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro no registo', error: err.message });
  }
});


// Rota de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    req.session.user = user;
    res.json({ message: 'Login efetuado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro no login', error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Sessão terminada' });
});

module.exports = router;
