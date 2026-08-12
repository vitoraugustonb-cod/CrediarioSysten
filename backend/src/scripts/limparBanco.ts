import { prisma } from '../lib/prisma.js';

async function limparBanco() {
  console.log('🧹 Iniciando limpeza completa de dados de teste...');

  // Deleta na ordem exata de dependência (Foreign Keys)
  const countAuditoria = await prisma.auditoria.deleteMany({});
  console.log(`- Auditoria: ${countAuditoria.count} registros removidos.`);

  const countParcela = await prisma.parcela.deleteMany({});
  console.log(`- Parcela: ${countParcela.count} registros removidos.`);

  const countItemVenda = await prisma.itemVenda.deleteMany({});
  console.log(`- ItemVenda: ${countItemVenda.count} registros removidos.`);

  const countVenda = await prisma.venda.deleteMany({});
  console.log(`- Venda: ${countVenda.count} registros removidos.`);

  const countCliente = await prisma.cliente.deleteMany({});
  console.log(`- Cliente: ${countCliente.count} registros removidos.`);

  const countProduto = await prisma.produto.deleteMany({});
  console.log(`- Produto: ${countProduto.count} registros removidos.`);

  const countUsuario = await prisma.usuario.deleteMany({});
  console.log(`- Usuario: ${countUsuario.count} registros removidos.`);

  console.log('✨ Limpeza de dados concluída!');
  
  await prisma.$disconnect();
}

limparBanco().catch((err) => {
  console.error('❌ Erro durante a limpeza do banco:', err);
  process.exit(1);
});
