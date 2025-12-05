import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes'; // Importa o roteador principal

// Inicialização do aplicativo Express
const app = express();

// Middlewares essenciais
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json()); // Permite que o servidor entenda JSON

// Servir arquivos estáticos da pasta 'public' (para HTML, CSS, JS do front-end)
// __dirname é o diretório do arquivo atual (dist/)
app.use(express.static(path.join(__dirname, '..', 'public')));

// CORREÇÃO: Aplica o prefixo /api a todas as rotas, SEM o middleware de autenticação global.
// A autenticação agora é gerenciada dentro de cada roteador, conforme necessário.
app.use('/api', routes);

// Rota de fallback para servir o index.html para qualquer rota não-API (suporte a SPA)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
});

// Definição da porta e inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});
