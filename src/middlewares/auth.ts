
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definindo a estrutura do payload do token que esperamos
interface TokenPayload {
  id: number;
  nome: string;
}

// Estendendo a interface de Request do Express para adicionar nossa propriedade 'usuario'
declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload; // A requisição pode ter um objeto de usuário
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token com formato inválido' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não está configurado no servidor.');
    return res.status(500).json({ error: 'Falha interna no servidor' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // **CORREÇÃO: Anexando o payload decodificado (id e nome) a req.usuario**
    req.usuario = decoded as TokenPayload;

    return next();
  });
};
