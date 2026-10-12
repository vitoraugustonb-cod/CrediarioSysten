import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function main() {
  const email = 'cesar@crediario.com';
  const senhaPlana = '123456';
  const nome = 'Cesar';

  // Verifica se já existe
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  let usuario;
  if (usuarioExistente) {
    usuario = await prisma.usuario.update({
      where: { email },
      data: {
        nome,
        senhaHash,
        perfil: 'VENDEDOR_COBRADOR',
        ativo: true
      }
    });
    console.log(`ℹ️ Usuário Cesar atualizado com sucesso!`);
  } else {
    usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil: 'VENDEDOR_COBRADOR',
        ativo: true
      }
    });
    console.log('✅ Usuário Cesar criado com sucesso!');
  }

  console.log(`📌 ID: ${usuario.id}`);
  console.log(`📌 Nome: ${usuario.nome}`);
  console.log(`📌 E-mail: ${usuario.email}`);
  console.log(`📌 Senha: ${senhaPlana}`);
  console.log(`📌 Perfil: ${usuario.perfil}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar usuário Cesar:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
