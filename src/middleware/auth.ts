import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt-padrao';

// Estendendo a interface Request do Express para incluir a propriedade 'usuario'
interface AuthenticatedRequest extends Request {
    usuario?: { id: number; nome: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; nome: string };
        req.usuario = decoded; // Adiciona o payload do token à requisição
        next(); // Passa para o próximo middleware ou rota
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
