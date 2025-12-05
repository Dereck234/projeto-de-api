document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DO DOM ---
  const filmeDetalheContainer = document.getElementById('filme-detalhe-container');
  const seletorDataContainer = document.getElementById('seletor-data-container');
  const sessoesAgrupadasContainer = document.getElementById('sessoes-agrupadas-container');

  // --- ESTADO DA APLICAÇÃO ---
  let filmeId = null;
  let todasAsSessoes = [];
  let datasDisponiveis = [];
  let dataSelecionada = null;

  // --- FUNÇÕES DE RENDERIZAÇÃO ---

  const renderizarDetalhesFilme = (filme) => {
    filmeDetalheContainer.innerHTML = `
      <img src="${filme.imagem || 'https://via.placeholder.com/200x300'}" alt="Cartaz de ${filme.titulo}">
      <div class="filme-info">
        <h2>${filme.titulo}</h2>
      </div>
    `;
  };

  const renderizarSeletorDeData = () => {
    if (datasDisponiveis.length === 0) {
        seletorDataContainer.innerHTML = '';
        sessoesAgrupadasContainer.innerHTML = '<p>Nenhuma sessão encontrada para este filme.</p>';
        return;
    }

    let html = '';
    const formatadorDiaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

    datasDisponiveis.forEach(dataISO => {
        const dataObj = new Date(dataISO + 'T00:00:00');
        const diaSemana = formatadorDiaSemana.format(dataObj).toUpperCase().replace('.','');
        const diaMes = dataObj.getDate();
        const classe = dataISO === dataSelecionada ? 'active' : '';

        html += `
            <button class="data-btn ${classe}" data-data="${dataISO}">
                <span class="data-dia-semana">${diaSemana}</span>
                <span class="data-dia-mes">${diaMes}</span>
            </button>
        `;
    });
    seletorDataContainer.innerHTML = html;
  };

  const renderizarSessoesParaData = () => {
    const sessoesDoDia = todasAsSessoes.filter(s => s.data.startsWith(dataSelecionada));

    if (sessoesDoDia.length === 0) {
        sessoesAgrupadasContainer.innerHTML = '<p>Nenhuma sessão para esta data.</p>';
        return;
    }

    const sessoesAgrupadas = sessoesDoDia.reduce((acc, sessao) => {
        const chaveGrupo = `${sessao.local} - ${sessao.tipo}`;
        if (!acc[chaveGrupo]) acc[chaveGrupo] = [];
        acc[chaveGrupo].push(sessao);
        return acc;
    }, {});

    let html = '';
    for (const grupo in sessoesAgrupadas) {
        html += `<div class="sessao-grupo">
                    <h4 class="sessao-grupo-titulo">${grupo}</h4>
                    <div class="horarios-grid">
                        ${sessoesAgrupadas[grupo].map(s => `<button class="horario-btn" data-sessao-id="${s.id}">${s.horarios}</button>`).join('')}
                    </div>
                 </div>`;
    }
    sessoesAgrupadasContainer.innerHTML = html;
  };

  // --- LÓGICA DE NEGÓCIO E EVENTOS ---

  const carregarDados = async () => {
    const params = new URLSearchParams(window.location.search);
    filmeId = params.get('id');
    if (!filmeId) {
      filmeDetalheContainer.innerHTML = '<p class="error-message">Filme não especificado.</p>';
      return;
    }

    try {
      const [filmeRes, sessoesRes] = await Promise.all([
        fetch(`/api/filmes/${filmeId}`),
        fetch(`/api/sessoes/filme/${filmeId}`)
      ]);

      if (!filmeRes.ok) throw new Error('Filme não encontrado');
      const filme = await filmeRes.json();
      renderizarDetalhesFilme(filme);

      if (!sessoesRes.ok) throw new Error('Não foi possível carregar as sessões');
      todasAsSessoes = await sessoesRes.json();

      if (todasAsSessoes && todasAsSessoes.length > 0) {
        const datas = [...new Set(todasAsSessoes.map(s => s.data.split('T')[0]))].sort();
        datasDisponiveis = datas;
        dataSelecionada = datas[0];
        
        renderizarSeletorDeData();
        renderizarSessoesParaData();
      } else {
        renderizarSeletorDeData(); // Mostra mensagem de nenhuma sessão
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      filmeDetalheContainer.innerHTML += `<p class="error-message">${error.message}</p>`;
    }
  };

  const handleDataClick = (event) => {
    const targetButton = event.target.closest('.data-btn');
    if (!targetButton || targetButton.dataset.data === dataSelecionada) return;

    dataSelecionada = targetButton.dataset.data;

    renderizarSeletorDeData();
    renderizarSessoesParaData();
  };

  const encontrarPrimeiroAssentoLivre = (assentosOcupados) => {
      const fileiras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for (const fileira of fileiras) {
          for (const numero of numeros) {
              const assentoId = `${fileira}${numero}`;
              if (!assentosOcupados.includes(assentoId)) {
                  return assentoId; // Retorna o primeiro assento que não está na lista de ocupados
              }
          }
      }
      return null; // Retorna null se todos os assentos estiverem ocupados
  };

  const handleHorarioClick = async (event) => {
      const targetButton = event.target.closest('.horario-btn');
      if (!targetButton) return;

      const token = localStorage.getItem('token'); // << CORREÇÃO APLICADA
      if (!token) {
          alert('Você precisa estar logado para fazer uma reserva.');
          window.location.href = '/login.html';
          return;
      }

      const sessaoId = parseInt(targetButton.dataset.sessaoId, 10);
      const sessao = todasAsSessoes.find(s => s.id === sessaoId);

      if (!sessao) {
          alert('Erro: Sessão não encontrada.');
          return;
      }

      const primeiroLivre = encontrarPrimeiroAssentoLivre(sessao.assentosOcupados || []);

      if (!primeiroLivre) {
          alert('Sessão lotada! Por favor, escolha outro horário.');
          return;
      }

      if (!confirm(`Deseja confirmar a reserva para o assento ${primeiroLivre} nesta sessão?`)) {
          return; // Usuário cancelou a confirmação
      }

      try {
          const response = await fetch('/api/reservas', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ sessaoId: sessao.id, assentos: [primeiroLivre] }),
          });

          const resultado = await response.json();

          if (!response.ok) {
              throw new Error(resultado.message || 'Não foi possível fazer a reserva.');
          }

          alert(`Reserva confirmada com sucesso para o assento ${primeiroLivre}!`);

          // Atualiza o estado local da sessão para refletir o novo assento ocupado
          sessao.assentosOcupados.push(primeiroLivre);

      } catch (error) {
          console.error('Erro ao reservar:', error);
          alert(`Erro ao reservar: ${error.message}`);
      }
  };

  // --- INICIALIZAÇÃO DOS EVENT LISTENERS ---
  seletorDataContainer.addEventListener('click', handleDataClick);
  sessoesAgrupadasContainer.addEventListener('click', handleHorarioClick);

  // --- CARGA INICIAL ---
  carregarDados();
});