
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

import usuarioRoutes from './routes/usuarioRoutes';
import filmeRoutes from './routes/filmeRoutes';
import sessaoRoutes from './routes/sessaoRoutes';
import reservaRoutes from './routes/reservaRoutes'; // Importa as rotas de reserva

const app = express();

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// A rota principal agora serve o index.html
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Movemos a mensagem de boas-vindas para a rota /api
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Bem-vindo à API do Cinema!',
    endpoints: {
      usuarios: '/api/usuarios',
      login: '/api/login',
      perfil: '/api/usuarios/perfil',
      filmes: '/api/filmes',
      sessoes: '/api/sessoes',
      reservas: '/api/reservas' // Adiciona o novo endpoint
    }
  });
});

// --- ROTAS DA API ---
app.use('/api', usuarioRoutes);
app.use('/api/filmes', filmeRoutes);
app.use('/api/sessoes', sessaoRoutes);
app.use('/api', reservaRoutes); // Registra as rotas de reserva

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
