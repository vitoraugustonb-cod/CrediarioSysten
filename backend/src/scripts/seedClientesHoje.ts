import { prisma } from '../lib/prisma.js';
import { StatusParcela, CategoriaProduto } from '@prisma/client';

async function main() {
  console.log('🚀 Criando 3 clientes com parcelas vencendo HOJE para TODOS os vendedores/cobradores...');

  // 1. Buscar todos os usuários (especialmente VENDEDOR_COBRADOR e GERENTE)
  const cobradores = await prisma.usuario.findMany({
    where: { ativo: true }
  });

  if (cobradores.length === 0) {
    console.error('❌ Nenhum usuário ativo encontrado no banco.');
    return;
  }

  // 2. Garantir produto de teste
  let produto = await prisma.produto.findFirst();
  if (!produto) {
    produto = await prisma.produto.create({
      data: {
        nome: 'Sofá Retrátil 3 Lugares Premium',
        descricao: 'Sofá retrátil e reclinável de alta densidade',
        preco: 1500.00,
        categoria: CategoriaProduto.MOVEIS
      }
    });
  }

  const hoje = new Date();

  // Para garantir que a data do vencimento seja hoje, zeramos a hora para a comparação por dia
  const dataHojeVencimento = new Date();
  dataHojeVencimento.setHours(12, 0, 0, 0);

  const clientesDados = [
    {
      nome: 'Carlos Eduardo Silva',
      telefone: '(88) 99823-1122',
      endereco: 'Rua das Flores, 120 - Centro',
      referencias: 'Próximo à Praça Central',
      valorParcela: 150.00,
      valorTotalVenda: 600.00,
      numParcelas: 4
    },
    {
      nome: 'Fernanda Maria Oliveira',
      telefone: '(88) 98112-4455',
      endereco: 'Av. Dom Lino, 450 - Bairro Novo',
      referencias: 'Em frente ao Supermercado Guará',
      valorParcela: 200.00,
      valorTotalVenda: 800.00,
      numParcelas: 4
    },
    {
      nome: 'João Pedro Santos',
      telefone: '(88) 99401-7788',
      endereco: 'Rua Coronel Alexanzinho, 89',
      referencias: 'Ao lado da Farmácia Popular',
      valorParcela: 120.00,
      valorTotalVenda: 480.00,
      numParcelas: 4
    }
  ];

  // Criar registros para CADA usuário ativo (para garantir que Cezar e qualquer outro cobrador vejam em sua aba)
  for (const usuario of cobradores) {
    console.log(`\n📌 Gerando parcelas para o usuário: ${usuario.nome} (ID ${usuario.id} - ${usuario.perfil})`);

    for (const cInfo of clientesDados) {
      // Criar Cliente
      const cliente = await prisma.cliente.create({
        data: {
          nome: `${cInfo.nome} (${usuario.nome})`,
          telefone: cInfo.telefone,
          endereco: cInfo.endereco,
          referencias: cInfo.referencias
        }
      });

      // Criar Venda completa
      const venda = await prisma.venda.create({
        data: {
          clienteId: cliente.id,
          vendedorId: usuario.id,
          valorTotal: cInfo.valorTotalVenda,
          numParcelas: cInfo.numParcelas,
          dataVenda: hoje
        }
      });

      // Criar Item da Venda
      await prisma.itemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: produto.id,
          quantidade: 1,
          valorUnitario: cInfo.valorTotalVenda,
          subtotal: cInfo.valorTotalVenda
        }
      });

      // Criar Parcela #1 com Vencimento HOJE para o cobradorId = usuario.id
      await prisma.parcela.create({
        data: {
          vendaId: venda.id,
          cobradorId: usuario.id,
          numero: 1,
          valor: cInfo.valorParcela,
          dataVencimento: dataHojeVencimento,
          status: StatusParcela.PENDENTE
        }
      });

      // Criar parcelas restantes dos meses futuros
      for (let pNum = 2; pNum <= cInfo.numParcelas; pNum++) {
        const proxVenc = new Date(dataHojeVencimento);
        proxVenc.setMonth(proxVenc.getMonth() + (pNum - 1));

        await prisma.parcela.create({
          data: {
            vendaId: venda.id,
            cobradorId: usuario.id,
            numero: pNum,
            valor: cInfo.valorParcela,
            dataVencimento: proxVenc,
            status: StatusParcela.PENDENTE
          }
        });
      }

      console.log(`   ✅ Cliente "${cliente.nome}" -> Parcela #1 (R$ ${cInfo.valorParcela.toFixed(2)}) gerada para HOJE!`);
    }
  }

  console.log('\n🎉 Todos os clientes e parcelas de hoje foram gerados com sucesso para todos os usuários!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
