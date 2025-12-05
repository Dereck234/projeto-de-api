import { Router } from 'express';
import * as filmeController from '../controllers/FilmeController';
import * as sessaoController from '../controllers/SessaoController'; // Importa o controller de sessão

const router = Router();

// Rotas para Filmes
router.post('/', filmeController.criarFilme);
router.get('/', filmeController.obterFilmes);
router.get('/:id', filmeController.obterFilmePorId);
router.put('/:id', filmeController.atualizarFilme);
router.delete('/:id', filmeController.deletarFilme);

// Rota para obter todas as sessões de um filme específico
// GET /api/filmes/:filmeId/sessoes
router.get('/:filmeId/sessoes', sessaoController.obterSessoesPorFilme);

export default router;
