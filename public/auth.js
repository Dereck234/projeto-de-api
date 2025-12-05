
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');

  // Manipulador para o formulário de LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMessage.textContent = '';

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao fazer login');
        }

        // Sucesso! Salva o token e redireciona
        localStorage.setItem('authToken', data.token);
        window.location.href = '/perfil.html'; // Redireciona para a página de perfil

      } catch (error) {
        errorMessage.textContent = error.message;
      }
    });
  }

  // Manipulador para o formulário de REGISTRO
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMessage.textContent = '';

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao registrar');
        }

        // Se o registro foi bem-sucedido, faz o login automaticamente para obter o token
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Registro bem-sucedido, mas falha ao logar.');
        }

        // Sucesso! Salva o token e redireciona
        localStorage.setItem('authToken', loginData.token);
        window.location.href = '/perfil.html'; // Redireciona para a página de perfil

      } catch (error) {
        errorMessage.textContent = error.message;
      }
    });
  }
});
