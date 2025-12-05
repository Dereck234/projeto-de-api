import express from 'express';
import 'dotenv/config'; // Carrega as variáveis de ambiente
import { usuarioRoutes } from './src/routes/usuarioRoutes';
import { filmeRoutes } from './src/routes/filmeRoutes';
import { sessaoRoutes } from './src/routes/sessaoRoutes'; // Importa as rotas de sessões

const app = express();
const PORTA = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Rotas da aplicação
app.use('/usuarios', usuarioRoutes);
app.use('/filmes', filmeRoutes);
app.use('/sessoes', sessaoRoutes); // Adiciona as rotas de sessões

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
