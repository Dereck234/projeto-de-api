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
exports.obterSessoesPorFilme = exports.obterSessoes = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const getSessoesSchema = zod_1.z.object({
    filmeId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    local: zod_1.z.enum(['manaira', 'mangabeira']).optional(),
});
// CORREÇÃO: Exportando a função.
const obterSessoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filmeId, local } = getSessoesSchema.parse(req.query);
        const where = {};
        if (filmeId) {
            where.filmeId = filmeId;
        }
        if (local) {
            where.local = local;
        }
        const sessoes = yield prisma.sessao.findMany({ where });
        res.json(sessoes);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Parâmetros de consulta inválidos', details: error.flatten().fieldErrors });
        }
        console.error("Erro ao buscar sessões:", error);
        res.status(500).json({ error: 'Não foi possível buscar as sessões.' });
    }
});
exports.obterSessoes = obterSessoes;
const obterSessoesPorFilme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filmeId = parseInt(req.params.filmeId, 10);
        if (isNaN(filmeId)) {
            return res.status(400).json({ message: 'ID de filme inválido.' });
        }
        const sessoes = yield prisma.sessao.findMany({
            where: { filmeId: filmeId },
        });
        res.json(sessoes);
    }
    catch (error) {
        console.error('Erro ao buscar sessões por filme:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar sessões.' });
    }
});
exports.obterSessoesPorFilme = obterSessoesPorFilme;
//# sourceMappingURL=SessaoController.js.map