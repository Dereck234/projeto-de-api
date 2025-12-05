import { Router } from 'express';
import filmeRoutes from './filmeRoutes';
import sessaoRoutes from './sessaoRoutes';
import usuarioRoutes from './usuarioRoutes';
import reservaRoutes from './reservaRoutes'; // Importa as rotas de reserva

const router = Router();

// As rotas de filmes e sessões são públicas
router.use('/filmes', filmeRoutes);
router.use('/sessoes', sessaoRoutes);

// As rotas de usuário (incluindo login/cadastro) são gerenciadas pelo seu próprio roteador
router.use(usuarioRoutes);

// Adiciona as rotas de reserva ao roteador principal
router.use(reservaRoutes);

export default router;
