import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

/**
 * Cria o vendedor Cesar caso ele ainda não exista.
 * Se já existir, NÃO altera nada (para trocar a senha, use o script trocar-senha).
 * A senha inicial vem da variável de ambiente SENHA_INICIAL.
 */
async function main() {
  const email = 'cesar@crediario.com';
  const senhaPlana = process.env.SENHA_INICIAL || '';
  const nome = 'Cesar';

  if (senhaPlana.length < 8) {
    throw new Error('Defina SENHA_INICIAL (mínimo 8 caracteres) nas variáveis de ambiente.');
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (usuarioExistente) {
    console.log(`ℹ️ Usuário Cesar (${email}) já existe. Nada foi alterado.`);
    return;
  }

  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      perfil: 'VENDEDOR_COBRADOR',
      ativo: true
    }
  });

  console.log('✅ Usuário Cesar criado com sucesso!');
  console.log(`📌 ID: ${usuario.id}`);
  console.log(`📌 Nome: ${usuario.nome}`);
  console.log(`📌 E-mail: ${usuario.email}`);
  console.log(`📌 Perfil: ${usuario.perfil}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar usuário Cesar:', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
