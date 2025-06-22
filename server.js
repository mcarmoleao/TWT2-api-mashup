const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isAuthenticated = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Teste de Rota
/*app.get('/protegido', isAuthenticated, (req, res) => {
  res.send(`Olá ${req.session.user.username}, estás autenticado!`);
});*/

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use(express.static('frontend'));

// Rotas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
const pesquisaRoutes = require('./routes/pesquisa.routes');
app.use('/pesquisa', pesquisaRoutes);


// Conexão MongoDB + Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Ligado ao MongoDB");
    app.listen(3000, () => console.log("🚀 Servidor a correr em http://localhost:3000"));
  })
  .catch(err => console.error("Erro ao ligar à base de dados:", err));
