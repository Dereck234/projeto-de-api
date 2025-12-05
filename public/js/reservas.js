document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Se não estiver logado, redireciona ou mostra uma mensagem
        window.location.href = '/login.html';
        return;
    }

    carregarReservas(token);
});

async function carregarReservas(token) {
    const container = document.getElementById('reservas-container');
    try {
        const response = await fetch('/api/reservas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token inválido ou expirado, deslogar
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '/login.html';
                return;
            }
            throw new Error('Falha ao buscar reservas.');
        }

        const reservas = await response.json();

        if (reservas.length === 0) {
            container.innerHTML = '<p>Você ainda não fez nenhuma reserva.</p>';
            return;
        }

        // Limpa o conteúdo de "carregando..."
        container.innerHTML = '';

        for (const reserva of reservas) {
            // Cria um card para cada reserva
            const card = document.createElement('div');
            card.className = 'reserva-card';
            card.innerHTML = `
                <div class="reserva-info">
                    <h3>${reserva.sessao.filme.titulo}</h3>
                    <p><strong>Data:</strong> ${new Date(reserva.sessao.dataHora).toLocaleDateString()}</p>
                    <p><strong>Horário:</strong> ${new Date(reserva.sessao.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p><strong>Sala:</strong> ${reserva.sessao.sala}</p>
                    <p><strong>Assento:</strong> ${reserva.assento}</p>
                </div>
                <div class="reserva-actions">
                    <button class="btn-cancelar" data-reserva-id="${reserva.id}">Cancelar Reserva</button>
                </div>
            `;
            container.appendChild(card);
        }

        // Adiciona os event listeners para os botões de cancelar
        document.querySelectorAll('.btn-cancelar').forEach(button => {
            button.addEventListener('click', handleCancelarReserva);
        });

    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        container.innerHTML = '<p style="color: red;">Ocorreu um erro ao carregar suas reservas. Tente novamente mais tarde.</p>';
    }
}

async function handleCancelarReserva(event) {
    const token = localStorage.getItem('token');
    const reservaId = event.target.dataset.reservaId;

    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
        return;
    }

    try {
        const response = await fetch(`/api/reservas/${reservaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao cancelar a reserva.');
        }

        // Recarrega as reservas para refletir a exclusão
        alert('Reserva cancelada com sucesso!');
        carregarReservas(token);

    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Não foi possível cancelar a reserva. Tente novamente.');
    }
}
