"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterPerfilUsuario = exports.loginUsuario = exports.criarUsuario = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto';
const criarUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: zod_1.z.string().email('Email inválido.'),
    senha: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido.'),
    senha: zod_1.z.string().nonempty('A senha é obrigatória.'),
});
const criarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, senha } = criarUsuarioSchema.parse(req.body);
        const usuarioExistente = yield prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(409).json({ error: 'Este email já está em uso.' });
        }
        const senhaHash = yield bcryptjs_1.default.hash(senha, 10);
        const novoUsuario = yield prisma.usuario.create({
            data: {
                nome,
                email,
                // CORREÇÃO: O campo no schema do Prisma é 'senhaHash'
                senhaHash: senhaHash,
            },
        });
        // CORREÇÃO: O campo a ser removido é 'senhaHash'
        const { senhaHash: _ } = novoUsuario, usuarioSemSenha = __rest(novoUsuario, ["senhaHash"]);
        res.status(201).json(usuarioSemSenha);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
        }
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao criar o usuário.' });
    }
});
exports.criarUsuario = criarUsuario;
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = loginSchema.parse(req.body);
        const usuario = yield prisma.usuario.findUnique({ where: { email } });
        // CORREÇÃO: Comparar com 'senhaHash' do banco de dados
        if (!usuario || !(yield bcryptjs_1.default.compare(senha, usuario.senhaHash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login bem-sucedido!', token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
        }
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno durante o login.' });
    }
});
exports.loginUsuario = loginUsuario;
const obterPerfilUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.usuario.id;
    try {
        const usuario = yield prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { id: true, nome: true, email: true },
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(usuario);
    }
    catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar o perfil.' });
    }
});
exports.obterPerfilUsuario = obterPerfilUsuario;
//# sourceMappingURL=UsuarioController.js.map