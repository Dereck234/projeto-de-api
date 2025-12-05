document.addEventListener('DOMContentLoaded', () => {
  // O ID correto do container do menu é 'nav-menu'
  const navMenu = document.getElementById('nav-menu');
  const token = localStorage.getItem('token'); // << CORREÇÃO: Usar 'token'
  const userName = localStorage.getItem('userName'); // Pega o nome do usuário

  if (token && userName) {
    // Usuário ESTÁ LOGADO
    navMenu.innerHTML = `
      <span class="nav-welcome">Olá, ${userName}!</span>
      <a href="/reservas.html" class="nav-button">Minhas Reservas</a> <!-- << CORREÇÃO: Link correto -->
      <button id="logout-button" class="nav-button-logout">Sair</button>
    `;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove o token
        localStorage.removeItem('userName'); // Remove o nome do usuário
        window.location.href = '/login.html'; // Redireciona para a página de login
      });
    }

  } else {
    // Usuário NÃO ESTÁ LOGADO
    navMenu.innerHTML = `
      <a href="/login.html" class="nav-button">Login</a>
      <a href="/cadastro.html" class="nav-button">Registrar</a>
    `;
  }
});