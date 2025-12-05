
import { Router } from 'express';
import { ReservaController } from '../controllers/ReservaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Rotas para reservas
router.post('/reservas', authMiddleware, ReservaController.createReserva);
router.get('/reservas', authMiddleware, ReservaController.getReservasByUsuario);
router.delete('/reservas/:id', authMiddleware, ReservaController.deleteReserva);

export default router;
