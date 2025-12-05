
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função auxiliar para criar a sessão com logs
async function criarSessao(filmeId: number, data: Date, local: string, tipo: string) {
  const horarios = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
  const sessaoCriada = await prisma.sessao.create({
    data: {
      filmeId,
      local,
      tipo,
      data,
      horarios,
      assentosOcupados: '[]', // Inicia vazio
    },
  });
  console.log(` -> Sessão criada para filme ${filmeId} em ${local} às ${horarios}`);
}

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Limpeza completa
  console.log('Limpando dados antigos...');
  await prisma.reserva.deleteMany({});
  await prisma.sessao.deleteMany({});
  await prisma.filme.deleteMany({});

  // 2. Criar filmes com os nomes de imagem corretos
  console.log('Criando filmes...');
  const filmeZootopia = await prisma.filme.create({ data: { titulo: 'Zootopia 2', imagem: '/imagens/Poster-Zootopia-2-1.webp' } });
  console.log(`Filme criado: ${filmeZootopia.titulo}`);
  const filmeFNAF = await prisma.filme.create({ data: { titulo: "Five Nights at Freddy's 2", imagem: '/imagens/fnaf 2.jpg' } });
  console.log(`Filme criado: ${filmeFNAF.titulo}`);
  const filmeWicked = await prisma.filme.create({ data: { titulo: 'Wicked: Parte 2', imagem: '/imagens/wicked parte 2.webp' } });
  console.log(`Filme criado: ${filmeWicked.titulo}`);

  const listaFilmes = [filmeZootopia, filmeFNAF, filmeWicked];

  // 3. Criar sessões para os próximos 5 dias
  console.log('\nCriando sessões para os próximos 5 dias...');
  const locais = ['Shopping Manaíra', 'Shopping Mangabeira'];
  const tipos = ['Dublado', 'Legendado', '3D Dublado'];

  for (let i = 0; i < 5; i++) {
    const dataBase = new Date();
    dataBase.setDate(dataBase.getDate() + i);
    console.log(`\n--- Criando para data: ${dataBase.toLocaleDateString('pt-BR')} ---`);

    for (const filme of listaFilmes) {
      console.log(`Para o filme: ${filme.titulo}`);
      // Varia os horários e locais para cada filme
      await criarSessao(filme.id, new Date(new Date(dataBase).setHours(16, 30, 0, 0)), locais[i % 2], tipos[0]);
      await criarSessao(filme.id, new Date(new Date(dataBase).setHours(20, 0, 0, 0)), locais[(i+1) % 2], tipos[1]);
      await criarSessao(filme.id, new Date(new Date(dataBase).setHours(21, 0, 0, 0)), locais[i % 2], tipos[2]);
    }
  }

  // 4. Criar reserva de exemplo
  console.log('\nCriando reserva de exemplo...');
  const primeiraSessao = await prisma.sessao.findFirst({
    where: { filme: { titulo: 'Zootopia 2' } }
  });

  if (primeiraSessao) {
    const assentosReservados = ['E5', 'E6'];
    await prisma.reserva.create({
      data: {
        nomeCliente: 'Judy Hopps',
        assentos: JSON.stringify(assentosReservados),
        sessaoId: primeiraSessao.id,
      },
    });
    await prisma.sessao.update({
        where: { id: primeiraSessao.id },
        data: { assentosOcupados: JSON.stringify(assentosReservados) }
    });
    console.log(`Reserva de exemplo criada para a sessão ID ${primeiraSessao.id}`);
  }

  console.log('\nSeeding finalizado.');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
