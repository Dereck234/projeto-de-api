document.addEventListener('DOMContentLoaded', () => {
    // Faz a mágica acontecer: busca os filmes na nossa API
    fetch('/api/filmes')
        .then(response => response.json())
        .then(filmes => {
            const container = document.getElementById('filmes-container');
            if (filmes.length === 0) {
                container.innerHTML = '<p>Nenhum filme em cartaz no momento.</p>';
                return;
            }
            // Cria um cartão para cada filme retornado pela API
            filmes.forEach(filme => {
                const filmeDiv = document.createElement('div');
                filmeDiv.classList.add('filme-card');
                
                const imagem = filme.imagem ? `<img src="${filme.imagem}" alt="${filme.titulo}">` : '';

                filmeDiv.innerHTML = `
                    <a href="/filme.html?id=${filme.id}">
                        ${imagem}
                        <h2>${filme.titulo}</h2>
                    </a>
                `;
                container.appendChild(filmeDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar filmes:', error);
            const container = document.getElementById('filmes-container');
            container.innerHTML = '<p>Não foi possível carregar os filmes. Tente novamente mais tarde.</p>';
        });
});