import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquema de validação para criar um filme
const criarFilmeSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório."),
  sinopse: z.string().optional(),
  imagem: z.string().min(1, "A URL da imagem é obrigatória."), // CORRIGIDO
});

// Esquema de validação para atualizar um filme
const atualizarFilmeSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório.").optional(),
  sinopse: z.string().optional(),
  imagem: z.string().min(1, "A URL da imagem é obrigatória.").optional(), // CORRIGIDO
});

// 1. Criar um novo filme
export const criarFilme = async (req: Request, res: Response) => {
  try {
    const data = criarFilmeSchema.parse(req.body);
    const filme = await prisma.filme.create({ data });
    res.status(201).json(filme);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
    }
    console.error("Erro ao criar filme:", error);
    res.status(500).json({ error: 'Não foi possível criar o filme.' });
  }
};

// 2. Obter todos os filmes
export const obterFilmes = async (req: Request, res: Response) => {
  try {
    const filmes = await prisma.filme.findMany();
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao obter filmes:", error);
    res.status(500).json({ error: 'Não foi possível obter os filmes.' });
  }
};

// 3. Obter um filme por ID
export const obterFilmePorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filme = await prisma.filme.findUnique({ where: { id: Number(id) } });
    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }
    res.json(filme);
  } catch (error) {
    console.error("Erro ao obter filme por ID:", error);
    res.status(500).json({ error: 'Não foi possível obter o filme.' });
  }
};

// 4. Atualizar um filme
export const atualizarFilme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = atualizarFilmeSchema.parse(req.body);
    const filme = await prisma.filme.update({
      where: { id: Number(id) },
      data,
    });
    res.json(filme);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
    }
    console.error("Erro ao atualizar filme:", error);
    res.status(500).json({ error: 'Não foi possível atualizar o filme.' });
  }
};

// 5. Deletar um filme
export const deletarFilme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.filme.delete({ where: { id: Number(id) } });
    res.status(204).send(); // Sem conteúdo
  } catch (error) {
    console.error("Erro ao deletar filme:", error);
    res.status(500).json({ error: 'Não foi possível deletar o filme.' });
  }
};
