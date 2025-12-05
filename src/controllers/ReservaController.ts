
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Estendendo a interface Request para incluir a propriedade 'usuario' que vem do middleware
interface AuthenticatedRequest extends Request {
  usuario?: { id: number; nome: string; };
}

export const ReservaController = {
  
  async createReserva(req: AuthenticatedRequest, res: Response) {
    try {
      const { assentos, sessaoId } = req.body;
      const usuario = req.usuario;

      // Validação dos dados recebidos
      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      if (!Array.isArray(assentos) || assentos.length === 0 || !sessaoId) {
        return res.status(400).json({ message: 'Dados da reserva inválidos. Verifique assentos e ID da sessão.' });
      }

      const sessaoIdNumber = Number(sessaoId);

      // Transação para garantir a consistência dos dados
      const [novaReserva, sessaoAtualizada] = await prisma.$transaction(async (tx) => {
        const sessao = await tx.sessao.findUnique({ where: { id: sessaoIdNumber } });

        if (!sessao) throw new Error('Sessão não encontrada.');

        const assentosOcupados = JSON.parse(sessao.assentosOcupados || '[]');
        const assentosConflitantes = assentos.filter(a => assentosOcupados.includes(a));

        if (assentosConflitantes.length > 0) {
          throw new Error(`Conflito: Os assentos ${assentosConflitantes.join(', ')} já estão ocupados.`);
        }

        // Criar a reserva usando o nome do usuário, como o schema original espera
        const reserva = await tx.reserva.create({
          data: {
            nomeCliente: usuario.nome, // Usando o nome do usuário do token
            assentos: JSON.stringify(assentos), // Salvando a lista de assentos
            sessaoId: sessaoIdNumber,
          },
        });

        const novosAssentosOcupados = [...assentosOcupados, ...assentos];
        const sessaoAtualizadaTx = await tx.sessao.update({
          where: { id: sessaoIdNumber },
          data: { assentosOcupados: JSON.stringify(novosAssentosOcupados) },
        });

        return [reserva, sessaoAtualizadaTx];
      });

      res.status(201).json({ message: 'Reserva criada com sucesso!', reserva: novaReserva, sessao: sessaoAtualizada });

    } catch (error: any) {
      if (error.message.includes('Conflito')) {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === 'Sessão não encontrada.') {
        return res.status(404).json({ message: error.message });
      }
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({ message: 'Falha ao processar a reserva.', details: error.message });
    }
  },

  async getReservasByUsuario(req: AuthenticatedRequest, res: Response) {
    try {
      const usuario = req.usuario;
      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      // Buscando as reservas pelo nome do cliente, como o schema permite
      const reservas = await prisma.reserva.findMany({
        where: { nomeCliente: usuario.nome },
        include: {
          sessao: {
            include: {
              filme: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      res.status(200).json(reservas);

    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao buscar reservas', error: error.message });
    }
  },

  async deleteReserva(req: AuthenticatedRequest, res: Response) {
    try {
      const reservaId = parseInt(req.params.id, 10);
      const usuario = req.usuario;

      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }

      const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });

      // Garante que um usuário só possa deletar a própria reserva
      if (!reserva || reserva.nomeCliente !== usuario.nome) {
        return res.status(404).json({ message: 'Reserva não encontrada ou não pertence a este usuário.' });
      }

      // Lógica para liberar o assento (opcional, mas boa prática)
      await prisma.$transaction(async (tx) => {
          const sessao = await tx.sessao.findUnique({ where: { id: reserva.sessaoId } });
          if (sessao) {
              const assentosReservados = JSON.parse(reserva.assentos);
              const assentosOcupados = JSON.parse(sessao.assentosOcupados || '[]');
              const novosAssentosOcupados = assentosOcupados.filter((a: string) => !assentosReservados.includes(a));
              await tx.sessao.update({ 
                  where: { id: sessao.id }, 
                  data: { assentosOcupados: JSON.stringify(novosAssentosOcupados) }
              });
          }
          await tx.reserva.delete({ where: { id: reservaId } });
      });

      res.status(204).send(); // Sucesso, sem conteúdo

    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao deletar reserva', error: error.message });
    }
  },
};
