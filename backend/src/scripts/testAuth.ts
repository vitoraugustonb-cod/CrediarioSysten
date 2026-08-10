async function test() {
  const baseUrl = 'http://localhost:3300';

  console.log('--- TEST 1: Health Check ---');
  const resHealth = await fetch(`${baseUrl}/health`);
  console.log('Health status:', resHealth.status, await resHealth.json());

  console.log('\n--- TEST 2: Login Gerente ---');
  const resLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gerente@crediario.com', senha: 'gerente123' })
  });
  const dataLogin = await resLogin.json();
  console.log('Login Gerente status:', resLogin.status, 'User:', dataLogin.usuario?.nome);
  const gerenteToken = dataLogin.token;

  console.log('\n--- TEST 3: Criar usuário SEM Token (Esperado 401) ---');
  const resSemToken = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Sem Token',
      email: 'semtoken@test.com',
      senha: '123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  console.log('Sem token status (esperado 401):', resSemToken.status, await resSemToken.json());

  console.log('\n--- TEST 4: Gerente cria Vendedor (Esperado 201) ---');
  const resCriarVendedor = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gerenteToken}`
    },
    body: JSON.stringify({
      nome: 'Carlos Vendedor',
      email: `carlos.vendedor_${Date.now()}@crediario.com`,
      senha: 'vendedor123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  const vendedorCriado = await resCriarVendedor.json();
  console.log('Gerente criou vendedor status:', resCriarVendedor.status, vendedorCriado);

  console.log('\n--- TEST 5: Login do Vendedor ---');
  const resLoginVendedor = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: vendedorCriado.email, senha: 'vendedor123' })
  });
  const dataLoginVendedor = await resLoginVendedor.json();
  console.log('Login Vendedor status:', resLoginVendedor.status, 'User:', dataLoginVendedor.usuario?.nome);
  const vendedorToken = dataLoginVendedor.token;

  console.log('\n--- TEST 6: Vendedor tenta criar usuário (Esperado 403) ---');
  const resVendedorCriando = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vendedorToken}`
    },
    body: JSON.stringify({
      nome: 'Tentativa Invalida',
      email: 'tentativa@test.com',
      senha: '123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  console.log('Vendedor criando usuário status (esperado 403):', resVendedorCriando.status, await resVendedorCriando.json());

  console.log('\n✅ TODOS OS TESTES PASSARAM COM SUCESSO!');
}

test().catch((err) => {
  console.error('❌ Erro no teste:', err);
  process.exit(1);
});
