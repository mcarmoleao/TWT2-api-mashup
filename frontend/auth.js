// Login
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'  // MUITO IMPORTANTE para enviar cookies de sessão
      });

      if (res.ok) {
        window.location.href = '/index.html'; // redireciona para página de pesquisa
      } else {
        const data = await res.json();
        alert('Erro no login: ' + (data.message || 'Credenciais inválidas'));
      }
    } catch (err) {
      alert('Erro no servidor. Tenta novamente.');
      console.error(err);
    }
  });
}

// Registo
const formRegister = document.getElementById('formRegister');
if (formRegister) {
  formRegister.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (res.ok) {
        alert('Registo feito! Podes agora fazer login.');
        window.location.href = 'login.html'; // redireciona para login
      } else {
        const data = await res.json();
        alert('Erro no registo: ' + (data.message || 'Já existe um utilizador com esse nome'));
      }
    } catch (err) {
      alert('Erro no servidor. Tenta novamente.');
      console.error(err);
    }
  });
}
