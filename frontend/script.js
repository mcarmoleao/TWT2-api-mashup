const btnPesquisar = document.getElementById('btnPesquisar');
const inputTermo = document.getElementById('inputTermo');
const resultadosDiv = document.getElementById('resultados');
const msgErro = document.getElementById('msgErro');

btnPesquisar.addEventListener('click', async () => {
  const termo = inputTermo.value.trim();
  if (!termo) {
    msgErro.textContent = 'Por favor, escreve um termo para pesquisa.';
    return;
  }

  msgErro.textContent = '';
  resultadosDiv.innerHTML = 'A pesquisar...';

  try {
    const response = await fetch(`/pesquisa?q=${encodeURIComponent(termo)}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      resultadosDiv.innerHTML = '';
      msgErro.textContent = errorData.message || 'Erro na pesquisa.';
      return;
    }

    const data = await response.json();

    // Construir card horizontal do artista
    const artistaHTML = `
      <div class="card-artista">
        ${data.imagem_wikipedia ? `<img src="${data.imagem_wikipedia}" alt="Imagem Wikipedia">` : ''}
        <div class="info">
          <h3>${data.artista}</h3>
          <p>${data.bio}</p>
        </div>
      </div>
    `;

    // Construir galeria de imagens (Unsplash)
    let imagensHTML = '';
    if (data.imagens_unsplash && data.imagens_unsplash.length > 0) {
      imagensHTML = `
        <div class="imagens-artisticas">
          ${data.imagens_unsplash.map(url => `<img src="${url}" alt="Imagem relacionada">`).join('')}
        </div>
      `;
    }

    resultadosDiv.innerHTML = artistaHTML + imagensHTML;

  } catch (error) {
    resultadosDiv.innerHTML = '';
    msgErro.textContent = 'Erro ao comunicar com o servidor.';
    console.error(error);
  }
});

// Botão para carregar histórico de pesquisas
document.getElementById('btnHistorico').addEventListener('click', async () => {
  try {
    resultadosDiv.innerHTML = 'A carregar histórico...';
    msgErro.textContent = '';

    const res = await fetch('/pesquisa/historico', { credentials: 'include' });
    if (!res.ok) {
      resultadosDiv.innerHTML = '';
      msgErro.textContent = 'Erro ao obter histórico.';
      return;
    }

    const historico = await res.json();

    if (historico.length === 0) {
      resultadosDiv.innerHTML = '<p>Sem pesquisas anteriores.</p>';
      return;
    }

    resultadosDiv.innerHTML = historico.map(entry => `
      <div class="card-artista">
        ${entry.resultados.imagem_wikipedia ? `<img src="${entry.resultados.imagem_wikipedia}" alt="Imagem Wikipedia">` : ''}
        <div class="info">
          <h3>${entry.resultados.artista}</h3>
          <p>${entry.resultados.bio}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    resultadosDiv.innerHTML = '';
    msgErro.textContent = 'Erro ao comunicar com o servidor.';
    console.error(err);
  }
});

// Botão de logout
document.getElementById('btnLogout').addEventListener('click', async () => {
  try {
    const res = await fetch('/auth/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/login.html';
    } else {
      alert('Erro ao fazer logout');
    }
  } catch (err) {
    alert('Erro ao fazer logout');
  }
});
