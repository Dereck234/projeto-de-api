
document.addEventListener('DOMContentLoaded', () => {
    const filmeSelect = document.getElementById('filme-select');
    const formCriarFilme = document.getElementById('form-criar-filme');
    const formCriarSessao = document.getElementById('form-criar-sessao');
    const filmeFeedback = document.getElementById('filme-feedback');
    const sessaoFeedback = document.getElementById('sessao-feedback');

    // Função para mostrar mensagens de feedback
    const mostrarFeedback = (elemento, mensagem, tipo) => {
        elemento.textContent = mensagem;
        elemento.className = `feedback-message ${tipo}`;
    };

    // 1. Carregar os filmes existentes no seletor de sessões
    const carregarFilmes = () => {
        fetch('/api/filmes')
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.json();
            })
            .then(filmes => {
                filmeSelect.innerHTML = '<option value="">Selecione um filme</option>'; // Limpa e adiciona opção padrão
                filmes.forEach(filme => {
                    const option = document.createElement('option');
                    option.value = filme.id;
                    option.textContent = filme.titulo;
                    filmeSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar filmes:', error);
                filmeSelect.innerHTML = '<option value="">Não foi possível carregar os filmes</option>';
            });
    };

    // 2. Lidar com o envio do formulário para criar um novo FILME
    formCriarFilme.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(formCriarFilme);
        const dados = Object.fromEntries(formData.entries());

        fetch('/api/filmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                // Extrai os detalhes do erro do Zod, se disponíveis
                const detalhes = data.details ? JSON.stringify(data.details, null, 2) : data.error;
                throw new Error(`Erro ao criar filme: ${detalhes}`);
            }
            mostrarFeedback(filmeFeedback, `Filme "${data.titulo}" criado com sucesso!`, 'success');
            formCriarFilme.reset(); // Limpa o formulário
            carregarFilmes(); // Recarrega a lista de filmes para incluir o novo
        })
        .catch(error => {
            console.error('Erro no formulário de filme:', error);
            mostrarFeedback(filmeFeedback, error.message, 'error');
        });
    });

    // 3. Lidar com o envio do formulário para criar uma nova SESSÃO
    formCriarSessao.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(formCriarSessao);
        const dados = Object.fromEntries(formData.entries());

        // Converte os dados para os tipos corretos que a API espera
        const corpoRequisicao = {
            filmeId: parseInt(dados.filmeId, 10),
            data: new Date(dados.data).toISOString(), // Formato ISO-8601
            local: dados.local,
            tipo: dados.tipo
        };

        fetch('/api/sessoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpoRequisicao)
        })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                 const detalhes = data.details ? JSON.stringify(data.details, null, 2) : data.error;
                throw new Error(`Erro ao criar sessão: ${detalhes}`);
            }
            mostrarFeedback(sessaoFeedback, `Sessão criada com sucesso para o dia ${new Date(data.data).toLocaleString()}.`, 'success');
            formCriarSessao.reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro no formulário de sessão:', error);
            mostrarFeedback(sessaoFeedback, error.message, 'error');
        });
    });

    // Carregar os filmes assim que a página é aberta
    carregarFilmes();
});
