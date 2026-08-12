import { prisma } from '../lib/prisma.js';

async function migrateData() {
  console.log('🔄 Iniciando migração de dados: Venda -> ItemVenda...');

  try {
    // 1. Garante que todo produto existente tenha uma categoria definida (padrão MOVEIS)
    await prisma.produto.updateMany({
      where: { categoria: undefined },
      data: { categoria: 'MOVEIS' }
    });
    console.log('✅ Categorias dos produtos atualizadas.');

    // 2. Busca vendas que ainda possam não ter registros em ItemVenda
    const vendasSemItens = await prisma.venda.findMany({
      include: {
        itens: true
      }
    });

    let migradas = 0;
    for (const venda of vendasSemItens) {
      if (venda.itens.length === 0) {
        // Se a venda não tem itens criados, busca o primeiro produto cadastrado ou usa valor padrão
        const primeiroProduto = await prisma.produto.findFirst();
        if (primeiroProduto) {
          await prisma.itemVenda.create({
            data: {
              vendaId: venda.id,
              produtoId: primeiroProduto.id,
              quantidade: 1,
              valorUnitario: venda.valorTotal,
              subtotal: venda.valorTotal
            }
          });
          migradas++;
        }
      }
    }

    console.log(`✅ Migração concluída: ${migradas} vendas atualizadas com ItemVenda.`);
  } catch (error) {
    console.error('⚠️ Nota de migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
