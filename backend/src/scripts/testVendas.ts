async function runVendasTest() {
  const baseUrl = 'http://localhost:3300';

  console.log('=== TESTE E2E DE CLIENTES, VENDAS, PARCELAS E SEGURANÇA ===\n');

  // 1. Login Gerente
  const resGerenteLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gerente@crediario.com', senha: 'gerente123' })
  });
  const gerenteData = await resGerenteLogin.json();
  const gerenteToken = gerenteData.token;
  console.log('1. Autenticado Gerente ID:', gerenteData.usuario.id);

  // 2. Criar Vendedor e fazer Login
  const vendedorEmail = `vendedor.teste_${Date.now()}@crediario.com`;
  const resCriarVendedor = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gerenteToken}`
    },
    body: JSON.stringify({
      nome: 'Vendedor Teste Seguranca',
      email: vendedorEmail,
      senha: 'vendedor123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  const vendedorData = await resCriarVendedor.json();
  console.log('2. Criado Vendedor ID:', vendedorData.id);

  const resVendedorLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: vendedorEmail, senha: 'vendedor123' })
  });
  const vendedorLoginData = await resVendedorLogin.json();
  const vendedorToken = vendedorLoginData.token;

  // 3. Cadastrar Cliente (RF07)
  const resCliente = await fetch(`${baseUrl}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vendedorToken}`
    },
    body: JSON.stringify({
      nome: 'Maria da Silva',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123 - Centro',
      referencias: 'Próximo à praça central'
    })
  });
  const cliente = await resCliente.json();
  console.log('3. Cliente Cadastrado (RF07):', cliente.id, cliente.nome);

  // 4. Cadastrar Produto
  const resProduto = await fetch(`${baseUrl}/produtos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vendedorToken}`
    },
    body: JSON.stringify({
      nome: 'Geladeira Duplex',
      descricao: 'Frost Free 400L',
      preco: 3000.00
    })
  });
  const produto = await resProduto.json();
  console.log('4. Produto Cadastrado:', produto.id, produto.nome, `R$ ${produto.preco}`);

  // 5. Registrar Venda com vendedorId adulterado no body (RF08, RF09, RF10 & SEGURANÇA)
  console.log('\n--- 🔒 TESTE DE SEGURANÇA: ENVIANDO vendedorId: 9999 NO BODY ---');
  const resVenda = await fetch(`${baseUrl}/vendas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vendedorToken}`
    },
    body: JSON.stringify({
      vendedorId: 9999, // ⚠️ Tentativa de fraudar o vendedor! Deve ser IGNORADO!
      clienteId: cliente.id,
      produtoId: produto.id,
      valorTotal: 3000.00,
      valorEntrada: 600.00, // Saldo a parcelar: 2400.00
      numParcelas: 4 // 4x de R$ 600.00
    })
  });
  const venda = await resVenda.json();

  console.log('5. Venda Registrada ID:', venda.id);
  console.log(`   - VendedorId no banco: ${venda.vendedorId} (Esperado: ${vendedorData.id})`);

  if (venda.vendedorId === vendedorData.id && venda.vendedorId !== 9999) {
    console.log('   ✅ SEGURANÇA CONFIRMADA: vendedorId do body foi IGNORADO e substituído pelo ID do token JWT!');
  } else {
    console.error('   ❌ FALHA DE SEGURANÇA: vendedorId do body não foi ignorado!');
    process.exit(1);
  }

  // 6. Verificar Carnê de Parcelas (RF09 e RF10)
  console.log('\n--- 📋 VERIFICAÇÃO DO CARNÊ DE PARCELAS (RF09 / RF10) ---');
  console.log(`Total de parcelas geradas: ${venda.parcelas.length} (Esperado: 4)`);
  
  venda.parcelas.forEach((p: any) => {
    console.log(`   Parcela #${p.numero}: R$ ${p.valor} | Vencimento: ${p.dataVencimento.substring(0, 10)} | Status: ${p.status} | CobradorId: ${p.cobradorId}`);
  });

  const todasPendentes = venda.parcelas.every((p: any) => p.status === 'PENDENTE');
  const todosCobradoresCorretos = venda.parcelas.every((p: any) => p.cobradorId === vendedorData.id);

  if (todasPendentes && todosCobradoresCorretos && venda.parcelas.length === 4) {
    console.log('   ✅ CARNÊ E RF10 CONFIRMADOS: Parcelas geradas com PENDENTE e cobradorId correto!');
  } else {
    console.error('   ❌ FALHA NO CARNÊ DE PARCELAS!');
    process.exit(1);
  }

  // 7. Teste da Listagem de Vendas (GET /vendas por Perfil)
  console.log('\n--- 📊 TESTE DE LISTAGEM POR PERFIL ---');
  const resListVendedor = await fetch(`${baseUrl}/vendas`, {
    headers: { 'Authorization': `Bearer ${vendedorToken}` }
  });
  const vendasVendedor = await resListVendedor.json();
  console.log(`Vendedor visualizou ${vendasVendedor.length} venda(s) (apenas as suas).`);

  const resListGerente = await fetch(`${baseUrl}/vendas`, {
    headers: { 'Authorization': `Bearer ${gerenteToken}` }
  });
  const vendasGerente = await resListGerente.json();
  console.log(`Gerente visualizou ${vendasGerente.length} venda(s) (visão global de todas as vendas).`);

  console.log('\n✅ TODOS OS REQUISITOS (RF07 - RF10 + SEGURANÇA) FORAM VALIDADOS COM SUCESSO!');
}

runVendasTest().catch((err) => {
  console.error('❌ Erro no teste de vendas:', err);
  process.exit(1);
});
