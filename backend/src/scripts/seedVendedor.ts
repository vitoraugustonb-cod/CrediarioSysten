import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function main() {
  const email = 'vendedor@crediario.com';
  const senhaPlana = 'vendedor123';
  const nome = 'Vendedor Cobrador 01';

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (usuarioExistente) {
    console.log(`ℹ️ Usuário vendedor (${email}) já existe no banco de dados.`);
    return;
  }

  const senhaHash = await bcrypt.hash(senhaPlana, 12);

  const vendedor = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      perfil: 'VENDEDOR_COBRADOR',
      ativo: true
    }
  });

  console.log('✅ Usuário VENDEDOR / COBRADOR criado com sucesso no Supabase!');
  console.log(`📌 ID: ${vendedor.id}`);
  console.log(`📌 Nome: ${vendedor.nome}`);
  console.log(`📌 E-mail: ${vendedor.email}`);
  console.log(`📌 Senha padrão: ${senhaPlana}`);
  console.log(`📌 Perfil: ${vendedor.perfil}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar usuário vendedor:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
