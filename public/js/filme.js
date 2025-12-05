document.addEventListener('DOMContentLoaded', async () => {
    // --- ELEMENTOS DO DOM ---
    const filmeContainer = document.getElementById('filme-detalhe-container');

    // --- ESTADO DA APLICAÇÃO ---
    let filme = null;
    let sessoes = [];

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    const renderizarPagina = () => {
        if (!filme) return;

        // Limpa o container
        filmeContainer.innerHTML = '';

        // Cria a estrutura principal com as classes do style.css
        const filmeDetalheDiv = document.createElement('div');
        filmeDetalheDiv.className = 'filme-detalhe';

        filmeDetalheDiv.innerHTML = `
            <img src="${filme.imagem || 'https://via.placeholder.com/300x450'}" alt="Cartaz de ${filme.titulo}">
            <div class="filme-info-detalhe">
                <h2>${filme.titulo}</h2>
                <p>${filme.sinopse || 'Sinopse não disponível.'}</p>
                
                <div class="sessoes-list">
                    <h3>Próximas Sessões</h3>
                    <div id="lista-de-sessoes">
                        <!-- As sessões serão injetadas aqui -->
                    </div>
                </div>
            </div>
        `;

        filmeContainer.appendChild(filmeDetalheDiv);

        const listaDeSessoesContainer = document.getElementById('lista-de-sessoes');
        
        if (sessoes.length > 0) {
            // Ordena as sessões por data e horário
            sessoes.sort((a, b) => new Date(a.data + 'T' + a.horarios) - new Date(b.data + 'T' + b.horarios));

            sessoes.forEach(sessao => {
                const sessaoItem = document.createElement('div');
                sessaoItem.className = 'sessao-item';

                const dataFormatada = new Date(sessao.data + 'T00:00:00').toLocaleDateString('pt-BR');

                sessaoItem.innerHTML = `
                    <p>
                        <strong>${dataFormatada}</strong> às <strong>${sessao.horarios}</strong> <br>
                        <span>${sessao.tipo} - ${sessao.local}</span>
                    </p>
                    <div class="reserva-controls">
                         <button class="action-btn reserve-btn" data-sessao-id="${sessao.id}">Reservar</button>
                    </div>
                `;
                listaDeSessoesContainer.appendChild(sessaoItem);
            });
        } else {
            listaDeSessoesContainer.innerHTML = '<p>Nenhuma sessão encontrada para este filme.</p>';
        }
    };

    // --- LÓGICA DE NEGÓCIO E EVENTOS ---

    const encontrarPrimeiroAssentoLivre = (assentosOcupados) => {
        const fileiras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const numeros = Array.from({ length: 10 }, (_, i) => i + 1);
        for (const fileira of fileiras) {
            for (const numero of numeros) {
                const assentoId = `${fileira}${numero}`;
                if (!assentosOcupados.includes(assentoId)) {
                    return assentoId;
                }
            }
        }
        return null;
    };

    const handleReservaClick = async (event) => {
        if (!event.target.classList.contains('reserve-btn')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para fazer uma reserva.');
            window.location.href = '/login.html';
            return;
        }

        const sessaoId = parseInt(event.target.dataset.sessaoId, 10);
        const sessao = sessoes.find(s => s.id === sessaoId);

        if (!sessao) {
            alert('Erro: Sessão não encontrada.');
            return;
        }

        const primeiroLivre = encontrarPrimeiroAssentoLivre(sessao.assentosOcupados || []);

        if (!primeiroLivre) {
            alert('Sessão lotada! Por favor, escolha outra sessão.');
            return;
        }

        if (!confirm(`Deseja confirmar a reserva para o primeiro assento livre (${primeiroLivre}) nesta sessão?`)) {
            return;
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
                throw new Error(resultado.message || 'Não foi possível concluir a reserva.');
            }

            alert(`Reserva confirmada com sucesso para o assento ${primeiroLivre}!\nConsulte a página "Minhas Reservas" para mais detalhes.`);
            
            // Atualiza o estado localmente para refletir a reserva
            sessao.assentosOcupados.push(primeiroLivre);
            event.target.disabled = true; // Desabilita o botão para indicar que a reserva foi tentada
            event.target.textContent = "Reservado";

        } catch (error) {
            console.error('Erro ao reservar:', error);
            alert(`Erro ao reservar: ${error.message}`);
        }
    };

    const carregarDados = async () => {
        const params = new URLSearchParams(window.location.search);
        const filmeId = params.get('id');
        if (!filmeId) {
            filmeContainer.innerHTML = '<p class="error-message">Filme não especificado.</p>';
            return;
        }

        try {
            const [filmeRes, sessoesRes] = await Promise.all([
                fetch(`/api/filmes/${filmeId}`),
                fetch(`/api/sessoes/filme/${filmeId}`)
            ]);

            if (!filmeRes.ok) throw new Error('Filme não encontrado');
            filme = await filmeRes.json();

            sessoes = sessoesRes.ok ? await sessoesRes.json() : [];
            
            renderizarPagina();

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            filmeContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    };

    // --- INICIALIZAÇÃO ---
    await carregarDados();
    filmeContainer.addEventListener('click', handleReservaClick);
});