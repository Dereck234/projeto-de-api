
import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor Express + TypeScript');
});

// --- Rotas de Usuários ---
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Um usuário com este e-mail já existe.' });
    }
    res.status(500).json({ error: "Ocorreu um erro ao criar o usuário." });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário." });
    }
});

app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, name } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { email, name },
        });
        res.json(updatedUser);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.status(500).json({ error: "Ocorreu um erro ao atualizar o usuário." });
    }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.status(500).json({ error: "Ocorreu um erro ao deletar o usuário." });
    }
});


// --- Rotas de Posts ---
app.post('/posts', async (req: Request, res: Response) => {
    try {
        const { title, content, authorId } = req.body;
        const newPost = await prisma.post.create({
            data: { title, content, authorId },
        });
        res.status(201).json(newPost);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Autor não encontrado.' });
        res.status(500).json({ error: "Ocorreu um erro ao criar o post." });
    }
});

app.get('/posts', async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({ include: { author: true, categories: true } });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar os posts." });
    }
});

app.get('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { author: true, categories: true },
        });
        if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar o post." });
    }
});

app.put('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content },
        });
        res.json(updatedPost);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post não encontrado.' });
        res.status(500).json({ error: "Ocorreu um erro ao atualizar o post." });
    }
});

app.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post não encontrado.' });
        res.status(500).json({ error: "Ocorreu um erro ao deletar o post." });
    }
});

// --- Rotas de Categorias ---
app.post('/categories', async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const newCategory = await prisma.category.create({
            data: { name },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Uma categoria com este nome já existe.' });
        }
        res.status(500).json({ error: "Ocorreu um erro ao criar a categoria." });
    }
});

app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar as categorias." });
    }
});

app.get('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar a categoria." });
    }
});

app.put('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.json(updatedCategory);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Categoria não encontrada.' });
        res.status(500).json({ error: "Ocorreu um erro ao atualizar a categoria." });
    }
});

app.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Categoria não encontrada.' });
        res.status(500).json({ error: "Ocorreu um erro ao deletar a categoria." });
    }
});

app.get('/categories/:id/posts', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryWithPosts = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { posts: { include: { post: true } } },
        });

        if (!categoryWithPosts) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        res.json(categoryWithPosts.posts.map(p => p.post));
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao buscar os posts da categoria." });
    }
});


// --- Rota Many-to-Many ---
app.post('/posts/:id/categories', async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const { categoryIds } = req.body; // Esperando: [1, 2]

        if (!Array.isArray(categoryIds)) {
            return res.status(400).json({ error: 'O campo categoryIds deve ser um array.' });
        }

        // Transação para garantir a atomicidade da operação
        const result = await prisma.$transaction(async (tx) => {
            // 1. Deletar todas as associações existentes para este post
            await tx.postCategory.deleteMany({
                where: { postId: postId },
            });

            // 2. Criar as novas associações
            await tx.postCategory.createMany({
                data: categoryIds.map((catId: number) => ({
                    postId: postId,
                    categoryId: catId,
                })),
            });

            // 3. Retornar o post atualizado com as novas categorias
            return tx.post.findUnique({
                where: { id: postId },
                include: {
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        });

        res.json(result);

    } catch (error) {
        // P2025 é o erro para "registro não encontrado" na operação
        if (error.code === 'P2025' || error.code === 'P2003') {
            return res.status(404).json({ error: 'Post ou uma das categorias não foi encontrado.' });
        }
        res.status(500).json({ error: "Ocorreu um erro ao associar as categorias." });
    }
});


app.listen(port, () => {
  console.log(`[servidor]: Servidor rodando em http://localhost:${port}`);
});
