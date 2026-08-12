import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function resetBanco() {
  console.log('🧹 1. Deletando registros na ordem exata de dependências (Foreign Keys)...');

  const countAuditoria = await prisma.auditoria.deleteMany({});
  console.log(`   - Auditoria: ${countAuditoria.count} removidos.`);

  const countParcela = await prisma.parcela.deleteMany({});
  console.log(`   - Parcela: ${countParcela.count} removidos.`);

  const countItemVenda = await prisma.itemVenda.deleteMany({});
  console.log(`   - ItemVenda: ${countItemVenda.count} removidos.`);

  const countVenda = await prisma.venda.deleteMany({});
  console.log(`   - Venda: ${countVenda.count} removidos.`);

  const countCliente = await prisma.cliente.deleteMany({});
  console.log(`   - Cliente: ${countCliente.count} removidos.`);

  const countProduto = await prisma.produto.deleteMany({});
  console.log(`   - Produto: ${countProduto.count} removidos.`);

  const countUsuario = await prisma.usuario.deleteMany({});
  console.log(`   - Usuario: ${countUsuario.count} removidos.`);

  console.log('\n👑 2. Recriando usuário GERENTE inicial...');
  const email = 'gerente@crediario.com';
  const senhaPlana = 'gerente123';
  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  const gerente = await prisma.usuario.create({
    data: {
      nome: 'Gerente Principal',
      email,
      senhaHash,
      perfil: 'GERENTE',
      ativo: true
    }
  });

  console.log('\n✨ BANCO ZERADO E INICIALIZADO COM SUCESSO!');
  console.log(`📌 E-mail do Gerente: ${gerente.email}`);
  console.log(`📌 Senha do Gerente: ${senhaPlana}`);

  return {
    deletados: {
      Auditoria: countAuditoria.count,
      Parcela: countParcela.count,
      ItemVenda: countItemVenda.count,
      Venda: countVenda.count,
      Cliente: countCliente.count,
      Produto: countProduto.count,
      Usuario: countUsuario.count
    },
    gerente: {
      email: gerente.email,
      senha: senhaPlana
    }
  };
}

resetBanco()
  .catch((err) => {
    console.error('❌ Erro ao resetar banco de dados:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
