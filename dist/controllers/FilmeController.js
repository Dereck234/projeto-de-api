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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarFilme = exports.atualizarFilme = exports.obterFilmePorId = exports.obterFilmes = exports.criarFilme = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Esquema de validação para criar um filme
const criarFilmeSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(1, "O título é obrigatório."),
    sinopse: zod_1.z.string().optional(),
    caminhoDaImagem: zod_1.z.string().min(1, "O caminho da imagem é obrigatório."),
});
// Esquema de validação para atualizar um filme
const atualizarFilmeSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(1, "O título é obrigatório.").optional(),
    sinopse: zod_1.z.string().optional(),
    caminhoDaImagem: zod_1.z.string().min(1, "O caminho da imagem é obrigatório.").optional(),
});
// 1. Criar um novo filme
const criarFilme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = criarFilmeSchema.parse(req.body);
        const filme = yield prisma.filme.create({ data });
        res.status(201).json(filme);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // CORREÇÃO: Usando o método correto para extrair os erros.
            return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
        }
        console.error("Erro ao criar filme:", error);
        res.status(500).json({ error: 'Não foi possível criar o filme.' });
    }
});
exports.criarFilme = criarFilme;
// 2. Obter todos os filmes
const obterFilmes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filmes = yield prisma.filme.findMany();
        res.json(filmes);
    }
    catch (error) {
        console.error("Erro ao obter filmes:", error);
        res.status(500).json({ error: 'Não foi possível obter os filmes.' });
    }
});
exports.obterFilmes = obterFilmes;
// 3. Obter um filme por ID
const obterFilmePorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const filme = yield prisma.filme.findUnique({ where: { id: Number(id) } });
        if (!filme) {
            return res.status(404).json({ error: 'Filme não encontrado.' });
        }
        res.json(filme);
    }
    catch (error) {
        console.error("Erro ao obter filme por ID:", error);
        res.status(500).json({ error: 'Não foi possível obter o filme.' });
    }
});
exports.obterFilmePorId = obterFilmePorId;
// 4. Atualizar um filme
const atualizarFilme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = atualizarFilmeSchema.parse(req.body);
        const filme = yield prisma.filme.update({
            where: { id: Number(id) },
            data,
        });
        res.json(filme);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // CORREÇÃO: Usando o método correto.
            return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
        }
        console.error("Erro ao atualizar filme:", error);
        res.status(500).json({ error: 'Não foi possível atualizar o filme.' });
    }
});
exports.atualizarFilme = atualizarFilme;
// 5. Deletar um filme
const deletarFilme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.filme.delete({ where: { id: Number(id) } });
        res.status(204).send(); // Sem conteúdo
    }
    catch (error) {
        console.error("Erro ao deletar filme:", error);
        res.status(500).json({ error: 'Não foi possível deletar o filme.' });
    }
});
exports.deletarFilme = deletarFilme;
//# sourceMappingURL=FilmeController.js.map