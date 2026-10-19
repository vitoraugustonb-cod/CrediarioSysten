import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

/**
 * Troca a senha de UM usuário existente.
 * - Altera somente o campo senhaHash da linha cujo e-mail foi informado.
 * - Não cria, não apaga e não toca em nenhum outro registro.
 * - A senha nunca é escrita no código nem exibida no terminal.
 *
 * Uso (PowerShell):
 *   $env:EMAIL_USUARIO='gerente@crediario.com'; $env:NOVA_SENHA='SuaSenhaAqui'; npm --prefix backend run trocar-senha
 */
async function main() {
  const email = (process.env.EMAIL_USUARIO || '').trim().toLowerCase();
  const novaSenha = process.env.NOVA_SENHA || '';

  if (!email || !novaSenha) {
    throw new Error('Informe EMAIL_USUARIO e NOVA_SENHA nas variáveis de ambiente.');
  }

  if (novaSenha.length < 8) {
    throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true, nome: true, email: true, perfil: true, ativo: true }
  });

  if (!usuario) {
    throw new Error(`Nenhum usuário encontrado com o e-mail ${email}. Nada foi alterado.`);
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10);

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senhaHash }
  });

  console.log('✅ Senha alterada com sucesso.');
  console.log(`📌 ID: ${usuario.id}`);
  console.log(`📌 Nome: ${usuario.nome}`);
  console.log(`📌 E-mail: ${usuario.email}`);
  console.log(`📌 Perfil: ${usuario.perfil}`);
  console.log(`📌 Ativo: ${usuario.ativo}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao trocar senha:', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
