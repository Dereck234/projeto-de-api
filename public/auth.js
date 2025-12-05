document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    const handleLogin = async (email, senha) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }
            // Padronizando o armazenamento com 'token' e salvando o nome do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.nome); // Assumindo que a API retorna o nome do usuário
            window.location.href = '/minhas-reservas.html'; // Redireciona para a página de reservas
        } catch (error) {
            if (errorMessage) {
                errorMessage.textContent = error.message;
            }
            console.error('Falha no login:', error);
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            await handleLogin(email, senha);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorMessage) errorMessage.textContent = '';

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao registrar');
                }

                // Após o registro bem-sucedido, faz o login automaticamente
                alert('Registro bem-sucedido! Você será logado automaticamente.');
                await handleLogin(email, senha);

            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                }
                console.error('Falha no registro:', error);
            }
        });
    }
});