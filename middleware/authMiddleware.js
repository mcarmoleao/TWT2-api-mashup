function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ message: 'Não autorizado. Por favor, faça login.' });
  }
}

module.exports = isAuthenticated;
