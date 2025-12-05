import { Router } from 'express';
import { criarUsuario, loginUsuario, obterPerfilUsuario } from '../controllers/UsuarioController';
// CORREÇÃO FINAL: Corrigindo o caminho e o nome do arquivo do middleware.
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/usuarios', criarUsuario);
router.post('/login', loginUsuario);

// Rota protegida
router.get('/usuarios/perfil', authMiddleware, obterPerfilUsuario);

export default router;
