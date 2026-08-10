import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function main() {
  const email = 'gerente@crediario.com';
  const senhaPlana = 'gerente123';

  const gerenteExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (gerenteExistente) {
    console.log(`ℹ️ Usuário gerente (${email}) já existe no banco de dados.`);
    return;
  }

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

  console.log('✅ Primeiro usuário GERENTE criado com sucesso!');
  console.log(`📌 ID: ${gerente.id}`);
  console.log(`📌 Nome: ${gerente.nome}`);
  console.log(`📌 E-mail: ${gerente.email}`);
  console.log(`📌 Senha padrão: ${senhaPlana}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed do gerente:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
