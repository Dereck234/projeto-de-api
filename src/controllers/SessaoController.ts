
import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquema de validação para criar uma sessão
const criarSessaoSchema = z.object({
  filmeId: z.number().int(),
  data: z.string().datetime(),
  local: z.string().min(1),
  tipo: z.string().min(1),
});

// 1. Criar uma nova sessão
export const criarSessao = async (req: Request, res: Response) => {
  try {
    const parsedData = criarSessaoSchema.parse(req.body);

    const filme = await prisma.filme.findUnique({
      where: { id: parsedData.filmeId },
    });

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }

    const dataObj = new Date(parsedData.data);
    const horas = String(dataObj.getUTCHours()).padStart(2, '0');
    const minutos = String(dataObj.getUTCMinutes()).padStart(2, '0');
    const horarios = `${horas}:${minutos}`;

    const sessao = await prisma.sessao.create({
      data: {
        filmeId: parsedData.filmeId,
        local: parsedData.local,
        tipo: parsedData.tipo,
        data: dataObj,
        horarios: horarios,
      },
    });
    res.status(201).json(sessao);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
    }
    console.error("Erro ao criar sessão:", error);
    res.status(500).json({ error: 'Não foi possível criar a sessão.' });
  }
};

// 2. Obter todas as sessões de um filme específico
export const obterSessoesPorFilme = async (req: Request, res: Response) => {
  try {
    // Extrai o filmeId dos parâmetros da rota
    const { filmeId } = req.params;

    // Converte o ID para um número inteiro (base 10)
    const filmeIdInt = parseInt(filmeId, 10);

    // Validação para garantir que a conversão foi bem-sucedida
    if (isNaN(filmeIdInt)) {
      return res.status(400).json({ error: 'O ID do filme deve ser um número.' });
    }

    const sessoes = await prisma.sessao.findMany({
      where: {
        filmeId: filmeIdInt, // Usa o ID convertido e validado
      },
      orderBy: {
        data: 'asc', // Ordena as sessões pela data e hora
      },
    });

    // Parse do campo assentosOcupados para cada sessão
    const sessoesComAssentosParseados = sessoes.map(sessao => ({
      ...sessao,
      assentosOcupados: JSON.parse(sessao.assentosOcupados || '[]'),
    }));

    // Retorna as sessões encontradas (pode ser uma lista vazia)
    res.json(sessoesComAssentosParseados);
  } catch (error) {
    console.error("Erro ao obter sessões:", error);
    res.status(500).json({ error: 'Não foi possível obter as sessões.' });
  }
};
