
document.addEventListener('DOMContentLoaded', () => {
  const userNav = document.getElementById('user-nav');
  const token = localStorage.getItem('authToken');

  if (token) {
    // Usuário ESTÁ LOGADO
    userNav.innerHTML = `
      <a href="/minhas-reservas.html" class="nav-button">Minhas Reservas</a>
      <a href="/perfil.html" class="nav-button">Meu Perfil</a>
      <button id="logout-button" class="nav-button-logout">Sair</button>
    `;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken'); // Remove o token
        window.location.href = '/'; // Redireciona para a página inicial
      });
    }

  } else {
    // Usuário NÃO ESTÁ LOGADO
    userNav.innerHTML = `
      <a href="/login.html" class="nav-button">Login</a>
      <a href="/register.html" class="nav-button">Registrar</a>
    `;
  }
});
