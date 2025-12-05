import { Router } from 'express';
import * as sessaoController from '../controllers/SessaoController';

const router = Router();

// Rota para criar uma nova sessão
// POST /api/sessoes
router.post('/', sessaoController.criarSessao);

// Rota para obter todas as sessões de um filme específico
// GET /api/sessoes/filme/:filmeId
router.get('/filme/:filmeId', sessaoController.obterSessoesPorFilme);

export default router;
