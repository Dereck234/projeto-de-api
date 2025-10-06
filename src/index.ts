
import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// --- User Routes ---
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
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
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the user." });
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
        if (error.code === 'P2025') return res.status(404).json({ error: 'User not found.' });
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'User not found.' });
        res.status(500).json({ error: "An error occurred while deleting the user." });
    }
});


// --- Post Routes ---
app.post('/posts', async (req: Request, res: Response) => {
    try {
        const { title, content, authorId } = req.body;
        const newPost = await prisma.post.create({
            data: { title, content, authorId },
        });
        res.status(201).json(newPost);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Author not found.' });
        res.status(500).json({ error: "An error occurred while creating the post." });
    }
});

app.get('/posts', async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({ include: { author: true } });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching posts." });
    }
});

app.get('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { author: true },
        });
        if (!post) return res.status(404).json({ error: 'Post not found.' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the post." });
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
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post not found.' });
        res.status(500).json({ error: "An error occurred while updating the post." });
    }
});

app.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Post not found.' });
        res.status(500).json({ error: "An error occurred while deleting the post." });
    }
});

// --- Category Routes ---
app.post('/categories', async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const newCategory = await prisma.category.create({
            data: { name },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        res.status(500).json({ error: "An error occurred while creating the category." });
    }
});

app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching categories." });
    }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
