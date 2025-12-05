
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient, Usuario } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto';

// Esquemas de validação Zod
const criarUsuarioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  senha: z.string().nonempty('A senha é obrigatória.'),
});

// --- Funções do Controller ---

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = criarUsuarioSchema.parse(req.body);

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Este email já está em uso.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senhaHash },
    });

    const { senhaHash: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno ao criar o usuário.' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario || !await bcrypt.compare(senha, usuario.senhaHash)) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    // **CORREÇÃO: Incluindo ID e NOME no payload do token**
    const tokenPayload = { id: usuario.id, nome: usuario.nome };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login bem-sucedido!', token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
    }
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno durante o login.' });
  }
};

export const obterPerfilUsuario = async (req: Request, res: Response) => {
  // Acessando o usuário do objeto de requisição, que foi adicionado pelo middleware
  const usuarioFromRequest = (req as any).usuario;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioFromRequest.id },
      select: { id: true, nome: true, email: true }, // Seleciona apenas campos seguros
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno ao buscar o perfil.' });
  }
};
