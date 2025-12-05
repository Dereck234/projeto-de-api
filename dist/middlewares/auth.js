"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
        // Isso é uma falha de configuração do servidor, então o status é 500
        console.error('JWT_SECRET não está configurado no servidor.');
        return res.status(500).json({ error: 'Falha interna no servidor' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
        // Se o token for válido, o payload decodificado estará em 'decoded'
        const payload = decoded;
        req.userId = payload.id;
        return next();
    });
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map