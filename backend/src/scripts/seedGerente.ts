import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function main() {
  const email = (process.env.EMAIL_GERENTE || 'gerente@crediario.com').trim().toLowerCase();
  const senhaPlana = process.env.SENHA_INICIAL || '';

  if (senhaPlana.length < 8) {
    throw new Error('Defina SENHA_INICIAL (mínimo 8 caracteres) nas variáveis de ambiente.');
  }

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
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed do gerente:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
